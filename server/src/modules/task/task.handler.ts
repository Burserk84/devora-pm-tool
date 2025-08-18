import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const createTask = async (req: Request, res: Response) => {
  const { title, content, projectId } = req.body;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: req.user!.id,
    },
  });

  if (!project) {
    return res
      .status(404)
      .json({ message: "Project not found or you do not have access." });
  }

  const task = await prisma.task.create({
    data: {
      title,
      content,
      projectId,
    },
  });

  res.status(201).json({ data: task });
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
    include: {
      tasks: true,
    },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({ data: project });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  // Security Check: Ensure the user owns the project this task belongs to.
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        ownerId: req.user!.id,
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

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Security Check: Ensure the user owns the project this task belongs to.
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        ownerId: req.user!.id,
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
