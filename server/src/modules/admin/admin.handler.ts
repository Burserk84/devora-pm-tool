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
