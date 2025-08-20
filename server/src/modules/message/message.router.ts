import { Router } from "express";
import { getMessagesForProject } from "./message.handler";

// mergeParams allows this router to access params from its parent router (like :id)
const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", getMessagesForProject);

export default messageRouter;
