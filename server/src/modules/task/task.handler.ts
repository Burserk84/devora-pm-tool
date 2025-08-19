import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// CREATE a task if the user is a member of the project
export const createTask = async (req: Request, res: Response) => {
  const { title, description, projectId } = req.body;

  // SECURITY CHECK: Verify user is a member of the project
  const membership = await prisma.projectMembership.findFirst({
    where: {
      projectId: projectId,
      userId: req.user!.id,
    },
  });

  if (!membership) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not a member of this project." });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
    },
  });
  res.status(201).json({ data: task });
};

// GET a single task if the user is a member of the project
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // SECURITY CHECK: Nested check to see if user is a member of the task's project
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        members: {
          some: { userId: req.user!.id },
        },
      },
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    return res
      .status(404)
      .json({ message: "Task not found or you do not have access." });
  }

  res.status(200).json({ data: task });
};

// UPDATE a task if the user is a member of the project
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate, assigneeId } = req.body;

  // First, find the task to get its current state and check for access
  const taskToUpdate = await prisma.task.findFirst({
    where: {
      id,
      project: {
        members: {
          some: { userId: req.user!.id },
        },
      },
    },
  });

  if (!taskToUpdate) {
    return res
      .status(404)
      .json({ message: "Task not found or you do not have access." });
  }

  // Now, update the task
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId,
    },
  });

  // --- NOTIFICATION LOGIC ---
  // Check if a new assignee was added and it's not the user assigning it to themselves
  if (
    assigneeId &&
    assigneeId !== taskToUpdate.assigneeId &&
    assigneeId !== req.user!.id
  ) {
    await prisma.notification.create({
      data: {
        message: `${req.user!.name || "Someone"} assigned you to the task "${
          updatedTask.title
        }"`,
        recipientId: assigneeId,
        actionUrl: `/project/${updatedTask.projectId}`,
      },
    });
  }

  res.status(200).json({ data: updatedTask });
};
// UPDATE a task's status if the user is a member of the project
export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  // SECURITY CHECK
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        members: {
          some: { userId: req.user!.id },
        },
      },
    },
  });

  if (!task) {
    return res
      .status(404)
      .json({ message: "Task not found or you do not have access." });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status },
  });
  res.status(200).json({ data: updatedTask });
};

// DELETE a task if the user is a member of the project
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  // SECURITY CHECK
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        members: {
          some: { userId: req.user!.id },
        },
      },
    },
  });

  if (!task) {
    return res
      .status(404)
      .json({ message: "Task not found or you do not have access." });
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
};
