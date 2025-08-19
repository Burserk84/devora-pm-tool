import { Router } from "express";
import { getNotifications, markAllAsRead } from "./notification.handler";

const notificationRouter = Router();

notificationRouter.get("/", getNotifications);
notificationRouter.post("/read", markAllAsRead);

export default notificationRouter;
