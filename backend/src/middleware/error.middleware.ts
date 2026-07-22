import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "#/errors";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
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

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}
