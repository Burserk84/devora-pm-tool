import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all projects where the user is a member
export const getProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: req.user!.id,
        },
      },
    },
    include: {
      // We can also include member details if needed
      members: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
  res.status(200).json({ data: projects });
};

// POST a new project, making the creator an ADMIN
export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: req.user!.id,
          role: "ADMIN",
        },
      },
    },
  });
  res.status(201).json({ data: project });
};

// GET a single project if the user is a member
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { search, assigneeId } = req.query; // Get filters from query params

  // Build a dynamic 'where' clause for filtering tasks
  const taskWhereClause: any = {};
  if (search) {
    taskWhereClause.title = {
      contains: search as string,
      mode: "insensitive", // Case-insensitive search
    };
  }
  if (assigneeId) {
    taskWhereClause.assigneeId = assigneeId as string;
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      members: {
        some: {
          userId: req.user!.id,
        },
      },
    },
    include: {
      tasks: {
        where: taskWhereClause, // Apply the dynamic filter here
        include: {
          assignee: {
            select: { id: true, name: true },
          },
        },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!project) {
    return res
      .status(404)
      .json({ message: "Project not found or you do not have access" });
  }

  res.json({ data: project });
};

// DELETE a project, but only if the user is an ADMIN
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  // SECURITY CHECK: Verify user is an ADMIN of this project
  const membership = await prisma.projectMembership.findFirst({
    where: {
      projectId: id,
      userId: req.user!.id,
      role: "ADMIN",
    },
  });

  if (!membership) {
    return res.status(403).json({
      message: "Forbidden: You must be an admin to delete this project.",
    });
  }

  // Use a transaction to delete all related data first
  await prisma.$transaction([
    prisma.task.deleteMany({ where: { projectId: id } }),
    prisma.projectMembership.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);

  res.status(204).send();
};

export const inviteUserToProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { email: userToInviteEmail } = req.body;

  // 1. SECURITY CHECK: Verify the person making the request is an ADMIN
  const membership = await prisma.projectMembership.findFirst({
    where: {
      projectId,
      userId: req.user!.id,
      role: "ADMIN",
    },
  });

  if (!membership) {
    return res
      .status(403)
      .json({ message: "Forbidden: You must be an admin to invite users." });
  }

  // --- THIS IS THE CRUCIAL PART THAT WAS LIKELY MISSING ---
  // 2. VALIDATION: Check if the user to be invited exists
  const userToInvite = await prisma.user.findUnique({
    where: { email: userToInviteEmail },
  });

  if (!userToInvite) {
    return res
      .status(404)
      .json({ message: `User with email ${userToInviteEmail} not found.` });
  }
  // --------------------------------------------------------

  // 3. VALIDATION: Check if the user is already a member
  const existingMembership = await prisma.projectMembership.findFirst({
    where: {
      projectId,
      userId: userToInvite.id,
    },
  });

  if (existingMembership) {
    return res
      .status(400)
      .json({ message: "User is already a member of this project." });
  }

  // Find the project to get its name
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  // 4. THE ACTION: Create the new membership
  const newMember = await prisma.projectMembership.create({
    data: {
      projectId,
      userId: userToInvite.id,
      role: "MEMBER",
    },
  });

  // 5. NOTIFICATION LOGIC
  await prisma.notification.create({
    data: {
      message: `${req.user!.name || "Someone"} invited you to the project "${
        project.name
      }"`,
      recipientId: userToInvite.id,
      actionUrl: `/project/${projectId}`,
    },
  });

  res.status(201).json({ data: newMember });
};
export const updateMemberRole = async (req: Request, res: Response) => {
  const { id: projectId, memberId } = req.params;
  const { role } = req.body;

  // 1. SECURITY CHECK: Verify the person making the request is an ADMIN
  const requesterMembership = await prisma.projectMembership.findFirst({
    where: {
      projectId,
      userId: req.user!.id,
      role: "ADMIN",
    },
  });

  if (!requesterMembership) {
    return res
      .status(403)
      .json({ message: "Forbidden: You must be an admin to change roles." });
  }

  // 2. BUSINESS RULE: Prevent an admin from changing their own role
  // This ensures a project always has at least one admin.
  if (req.user!.id === memberId) {
    return res
      .status(400)
      .json({ message: "You cannot change your own role." });
  }

  // 3. THE ACTION: Update the target user's role
  const updatedMembership = await prisma.projectMembership.update({
    where: {
      // Use the composite @@id from the schema
      projectId_userId: {
        projectId,
        userId: memberId,
      },
    },
    data: { role },
  });

  res.status(200).json({ data: updatedMembership });
};
