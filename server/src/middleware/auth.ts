import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError(401, "Missing or invalid authorization header", "UNAUTHORIZED"));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
};
