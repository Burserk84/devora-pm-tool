import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all users (simplified for now)
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  res.status(200).json({ data: users });
};

// GET /api/users/me - Get the current logged-in user's profile
export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      title: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({ data: user });
};

// PUT /api/users/me - Update the current user's profile
export const updateCurrentUser = async (req: Request, res: Response) => {
  const { name, title } = req.body;

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user!.id,
    },
    data: {
      name,
      title,
    },
  });

  res.status(200).json({ data: updatedUser });
};
