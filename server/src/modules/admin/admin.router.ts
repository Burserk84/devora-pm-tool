import { Router } from "express";
import { createUser, getAllUsers, getAllProjects } from "./admin.handler";
import { isSuperAdmin } from "../../middlewares/admin.middleware";

const adminRouter = Router();

adminRouter.use(isSuperAdmin);

// Routes
adminRouter.post("/users", createUser);
adminRouter.get("/users", getAllUsers);
adminRouter.get("/projects", getAllProjects);

export default adminRouter;
