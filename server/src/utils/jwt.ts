import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthedUser } from "../types/auth.js";
import { AppError } from "./appError.js";

interface TokenPayload {
  sub: string;
  role: AuthedUser["role"];
}

export const signToken = (payload: AuthedUser): string => {
  return jwt.sign({ sub: payload.id, role: payload.role }, env.jwtSecret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): AuthedUser => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload;

    if (!decoded.sub || !decoded.role) {
      throw new AppError(401, "Invalid token payload", "INVALID_TOKEN");
    }

    return {
      id: decoded.sub,
      role: decoded.role,
    };
  } catch {
    throw new AppError(401, "Invalid or expired token", "INVALID_TOKEN");
  }
};
