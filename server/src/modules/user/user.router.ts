import { Router } from "express";
import { getUsers, getCurrentUser, updateCurrentUser } from "./user.handler";

const userRouter = Router();

userRouter.get("/me", getCurrentUser);
userRouter.put("/me", updateCurrentUser);

userRouter.get("/", getUsers);

export default userRouter;
