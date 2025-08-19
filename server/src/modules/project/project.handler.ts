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
      tasks: true, // Also include tasks for each project
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

// GET a single project by ID, with all its tasks and members
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

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
        include: {
          assignee: {
            select: { id: true, name: true, title: true },
          },
        },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, title: true },
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

  await prisma.$transaction([
    prisma.task.deleteMany({ where: { projectId: id } }),
    prisma.projectMembership.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);

  res.status(204).send();
};

// Invite a user to a project
export const inviteUserToProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { email: userToInviteEmail } = req.body;

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

  const userToInvite = await prisma.user.findUnique({
    where: { email: userToInviteEmail },
  });

  if (!userToInvite) {
    return res
      .status(404)
      .json({ message: `User with email ${userToInviteEmail} not found.` });
  }

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

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  const newMember = await prisma.projectMembership.create({
    data: {
      projectId,
      userId: userToInvite.id,
      role: "MEMBER",
    },
  });

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

// Update a member's role
export const updateMemberRole = async (req: Request, res: Response) => {
  const { id: projectId, memberId } = req.params;
  const { role } = req.body;

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

  if (req.user!.id === memberId) {
    return res
      .status(400)
      .json({ message: "You cannot change your own role." });
  }

  const updatedMembership = await prisma.projectMembership.update({
    where: {
      projectId_userId: {
        projectId,
        userId: memberId,
      },
    },
    data: { role },
  });

  res.status(200).json({ data: updatedMembership });
};
