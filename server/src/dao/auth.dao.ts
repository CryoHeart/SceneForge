import { UserRole } from "@prisma/client";
import { prisma } from "../prisma/client";

type CreateUserPayload = {
  email: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
};

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(payload: CreateUserPayload) {
  return prisma.user.create({ data: payload });
}
