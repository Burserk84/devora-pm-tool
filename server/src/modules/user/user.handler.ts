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
