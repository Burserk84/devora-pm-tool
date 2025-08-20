import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getMessagesForProject = async (req: Request, res: Response) => {
  // The projectId will come from the parent router's params
  const { projectId } = req.params;

  // We add a security check later to ensure user is a member

  const messages = await prisma.message.findMany({
    where: {
      projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc", // Show oldest messages first
    },
  });

  res.status(200).json({ data: messages });
};
