import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { hasRole } from "../utils/userType";

export function roleMiddleware(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (!hasRole(roles, req.user)) {
      next(new AppError("Forbidden", 403));
      return;
    }

    next();
  };
}
