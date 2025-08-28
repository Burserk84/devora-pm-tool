import { Router } from "express";
import { createUser } from "./admin.handler";
// We'll create this middleware next
// import { isSuperAdmin } from '../../middlewares/admin.middleware';

const adminRouter = Router();

// This route will be protected to ensure only a superadmin can access it
adminRouter.post("/users", createUser);

export default adminRouter;
