import { Request, Response } from "express";
import { asyncHandler } from "#/lib/async-handler";
import { AuthService } from "#/services";
import { loginUserSchema, registerUserSchema } from "#/validators";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerUserSchema.parse(req.body);
  const result = await authService.register(data);
  return res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginUserSchema.parse(req.body);
  const result = await authService.login(data);
  return res.status(200).json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  return res.status(200).json(user);
});

export const admin = asyncHandler(async (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Access granted",
  });
});
