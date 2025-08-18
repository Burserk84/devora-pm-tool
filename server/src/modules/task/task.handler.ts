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
