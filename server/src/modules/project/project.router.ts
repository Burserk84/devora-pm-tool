import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
  inviteUserToProject,
  updateMemberRole,
  getProjectsSummary,
} from "./project.handler";
import messageRouter from "../message/message.router";

const projectRouter = Router();

// Routes
projectRouter.get("/summary", getProjectsSummary);
projectRouter.get("/", getProjects);
projectRouter.post("/", createProject);
projectRouter.get("/:id", getProjectById);
projectRouter.delete("/:id", deleteProject);
projectRouter.post("/:id/members", inviteUserToProject);
projectRouter.patch("/:id/members/:memberId", updateMemberRole);
projectRouter.use("/:projectId/messages", messageRouter);

export default projectRouter;
