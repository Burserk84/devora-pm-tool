import { Request, Response, NextFunction } from "express";

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "SUPERADMIN") {
    return res.status(403).json({ message: "Forbidden: Access denied." });
  }
  next();
};
