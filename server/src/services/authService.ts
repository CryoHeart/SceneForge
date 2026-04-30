import type { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/jwt.js";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

const sanitizeUser = (user: {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existing) {
      throw new AppError(409, "User already exists", "USER_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashedPassword,
        role: input.role ?? "fan",
      },
    });

    const token = signToken({ id: user.id, role: user.role });

    return {
      token,
      user: sanitizeUser(user),
    };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token = signToken({ id: user.id, role: user.role });

    return {
      token,
      user: sanitizeUser(user),
    };
  },
};
