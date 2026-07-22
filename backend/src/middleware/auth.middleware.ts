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
