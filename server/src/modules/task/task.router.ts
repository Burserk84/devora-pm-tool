import { Router } from "express";
import { createTask } from "./task.handler";

const taskRouter = Router();

taskRouter.post("/", createTask);

export default taskRouter;
