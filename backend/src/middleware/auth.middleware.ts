import { verifyJwtToken } from "#/lib/jwt";
import { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authorization.split(" ")[1]!;

  try {
    req.user = verifyJwtToken(token);
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
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
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}