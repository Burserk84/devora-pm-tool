import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all notifications for the logged-in user
export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: req.user!.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json({ data: notifications });
};

// POST to mark all unread notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  await prisma.notification.updateMany({
    where: {
      recipientId: req.user!.id,
      read: false,
    },
    data: {
      read: true,
    },
  });
  res.status(204).send();
};
