import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation error",
      code: "VALIDATION_ERROR",
      issues: err.flatten(),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        message: "A unique constraint was violated",
        code: "CONFLICT",
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        message: "Resource not found",
        code: "NOT_FOUND",
      });
      return;
    }
  }

  const message = err instanceof Error ? err.message : "Unexpected server error";
  res.status(500).json({
    message,
    code: "INTERNAL_SERVER_ERROR",
  });
};
