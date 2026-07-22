import { NextFunction, Request, Response } from "express";
import { AuthService } from "#/services";
import { AuthRepository } from "#/repositories";
import { ZodError } from "zod";
import { loginUserSchema, registerUserSchema } from "#/validators";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerUserSchema.parse(req.body);
    const result = await authService.register(data);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginUserSchema.parse(req.body);
    const result = await authService.login(data);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  return res.status(200).json(user);
};
