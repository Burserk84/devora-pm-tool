import { Router } from "express";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskById,
  updateTask,
} from "./task.handler";

const taskRouter = Router();
taskRouter.post("/", createTask);
taskRouter.get("/:id", getTaskById);
taskRouter.put("/:id", updateTask);
taskRouter.patch("/:id/status", updateTaskStatus);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
