import { Request, Response } from "express";
import { AuthService } from "#/services";
import { AuthRepository } from "#/repositories";
import { ZodError } from "zod";
import { registerUserSchema } from "#/validators";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export const register = async (req: Request, res: Response) => {
  try {
    // validate user data
    const data = registerUserSchema.parse(req.body);

    // register user
    const result = await authService.register(data);

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0]!;

      if (issue.code === "invalid_type") {
        return res.status(400).json({
          message: `${String(issue.path[0])} is required`,
        });
      }

      return res.status(400).json({
        message: issue.message,
      });
    }

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
