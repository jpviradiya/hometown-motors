import { Request, Response } from "express";
import { AuthService } from "#/services";
import { AuthRepository } from "#/repositories";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const register = async (req: Request, res: Response) => {
  try {
    // register user
    const result = await authService.register(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
