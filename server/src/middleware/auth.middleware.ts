import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role as UserRole,
    };
    next();
  } catch {
    next(new AppError("Invalid token", 401));
  }
}
