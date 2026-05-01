import { UserRole } from "@prisma/client";
import { prisma } from "../prisma/client";
import { roleToUserTypeCode } from "../utils/userType";

export async function findAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      city: true,
      createdAt: true,
      userType: { select: { code: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function updateUserRole(userId: number, role: UserRole) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
      userType: { connect: { code: roleToUserTypeCode(role) } },
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      city: true,
      createdAt: true,
      userType: { select: { code: true } },
    },
  });
}

export async function deleteUserById(userId: number) {
  return prisma.user.delete({ where: { id: userId } });
}
