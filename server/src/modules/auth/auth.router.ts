import { Router } from "express";
import { register, login } from "./auth.handler";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema } from "../../lib/schemas";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", login);

export default authRouter;
