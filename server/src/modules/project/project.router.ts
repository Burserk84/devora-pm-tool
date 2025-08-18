import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} from "./project.handler";

const projectRouter = Router();

// Routes
projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
