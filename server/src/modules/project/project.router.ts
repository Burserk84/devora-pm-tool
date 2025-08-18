import { Router } from "express";
import { getProjects, createProject, getProjectById } from "./project.handler";

const projectRouter = Router();

// Routes
projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);

export default projectRouter;
