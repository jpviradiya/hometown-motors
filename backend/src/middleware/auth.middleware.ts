import { ForbiddenError, UnauthorizedError } from "#/errors";
import { verifyJwtToken } from "#/lib/jwt";
import { NextFunction, Request, Response } from "express";

// Validates JWT token in Authorization header and populates req.user.
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    req.user = verifyJwtToken(token);
    next();
  } catch {
    throw new UnauthorizedError();
  }
}

// Ensures authenticated user possesses required role for access control.
export function authorize(role: "ADMIN" | "USER") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (req.user.role !== role) {
      throw new ForbiddenError();
    }

    next();
  };
}
