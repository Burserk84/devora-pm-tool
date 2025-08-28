import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name, title } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      title,
      role: "USER",
    },
  });
  res.status(201).json({ data: user });
};

// GET all users in the system
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      role: true,
      createdAt: true,
    },
  });
  res.status(200).json({ data: users });
};

// GET all projects in the system
export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { tasks: true, members: true },
      },
    },
  });
  res.status(200).json({ data: projects });
};
