import { Router } from "express";
import { login, me, admin, register } from "#/controllers";
import { authenticate, authorize } from "#/middleware";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);
authRouter.get("/admin", authenticate, authorize("ADMIN"), admin);
