import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getAllProjects,
  deleteUser,
  deleteProject,
} from "./admin.handler";
import { isSuperAdmin } from "../../middlewares/admin.middleware";

const adminRouter = Router();

adminRouter.use(isSuperAdmin);

// Routes
adminRouter.post("/users", createUser);
adminRouter.get("/users", getAllUsers);
adminRouter.delete("/users/:id", deleteUser);

adminRouter.get("/projects", getAllProjects);
adminRouter.delete("/projects/:id", deleteProject);

export default adminRouter;
