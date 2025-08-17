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

// ... (We'll skip Update and Delete for now to keep it concise, but the pattern is the same)
