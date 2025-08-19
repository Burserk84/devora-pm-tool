import { Router } from "express";
import { getUsers } from "./user.handler";

const userRouter = Router();

userRouter.get("/", getUsers);

export default userRouter;
