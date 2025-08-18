import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all projects for the logged-in user
export const getProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: req.user!.id,
    },
    include: {
      tasks: true, // Also include tasks for each project
    },
  });
  res.status(200).json({ data: projects });
};

// POST a new project
export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: req.user!.id,
    },
  });
  res.status(201).json({ data: project });
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
    include: {
      tasks: true, // Include all tasks related to this project
    },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({ data: project });
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  // First, verify the user owns this project before doing anything
  const project = await prisma.project.findFirst({
    where: { id, ownerId: req.user!.id },
  });

  if (!project) {
    return res
      .status(404)
      .json({ message: "Project not found or you do not have access." });
  }

  // Use a transaction to delete tasks first, then the project
  await prisma.$transaction([
    prisma.task.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);

  res.status(204).send(); // 204 No Content is a standard response for a successful delete
};
