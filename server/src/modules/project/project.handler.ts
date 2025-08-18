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
