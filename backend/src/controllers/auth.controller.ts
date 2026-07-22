import { Request, Response } from "express";

import { AuthService } from "#/services";

const authService = new AuthService();

export const register = async (_req: Request, res: Response) => {
  const result = await authService.register();

  return res.status(201).json(result);
};