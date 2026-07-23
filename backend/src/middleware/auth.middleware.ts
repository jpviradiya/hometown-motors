import { UnauthorizedError } from "#/errors";
import { ForbiddenError } from "#/errors/forbidden.error";
import { verifyJwtToken } from "#/lib/jwt";
import { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authorization.split(" ")[1]!;

  try {
    req.user = verifyJwtToken(token);
    next();
  } catch {
    throw new UnauthorizedError()
  }
}
export function authorize(role: "ADMIN" | "USER") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.role !== role) {
      throw new ForbiddenError();
    }

    next();
  };
}

