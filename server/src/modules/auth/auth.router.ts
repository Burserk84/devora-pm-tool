import { Router } from "express";
import { login } from "./auth.handler";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "../../lib/schemas";

const authRouter = Router();

authRouter.post("/login", login);

export default authRouter;
