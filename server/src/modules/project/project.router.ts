import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
  inviteUserToProject,
  updateMemberRole,
} from "./project.handler";

const projectRouter = Router();

// Routes
projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);
projectRouter.delete("/:id", deleteProject);
projectRouter.post("/:id/members", inviteUserToProject);
projectRouter.patch("/:id/members/:memberId", updateMemberRole);

export default projectRouter;
