import { Router } from "express";
import { register } from "#/controllers";

export const authRouter = Router();

authRouter.post("/register", register);
