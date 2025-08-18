import { Router } from "express";
import { createTask, updateTaskStatus, deleteTask } from "./task.handler";

const taskRouter = Router();

taskRouter.post("/", createTask);
taskRouter.patch("/:id/status", updateTaskStatus);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
