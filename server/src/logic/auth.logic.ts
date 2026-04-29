import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { createUser, findUserByEmail } from "../dao/auth.dao";
import { LoginInput, RegisterInput } from "../types/api";
import { AppError } from "../utils/appError";
import { signToken } from "../utils/jwt";

const allowedRoles: UserRole[] = ["fan", "band_admin", "venue_admin", "admin"];

export async function register(input: RegisterInput) {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  const displayName = input.displayName?.trim();

  if (!email || !password || !displayName) {
    throw new AppError("email, password and displayName are required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const role = input.role ?? UserRole.fan;
  if (!allowedRoles.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    email,
    passwordHash,
    displayName,
    role,
  });

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
  };
}

export async function login(input: LoginInput) {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
  };
}
