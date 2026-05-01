import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { AppError } from "./appError";
import { UserTypeCode } from "./userType";

export type JwtPayload = {
  userId: number;
  role: UserRole;
  userTypeCode?: UserTypeCode;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload !== "object" || !payload || !("userId" in payload) || !("role" in payload)) {
    throw new AppError("Invalid token payload", 401);
  }

  return payload as JwtPayload;
}
