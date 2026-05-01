import { UserRole } from "@prisma/client";
import { deleteUserById, findAllUsers, updateUserRole } from "../dao/admin.dao";
import { AppError } from "../utils/appError";

const validRoles: UserRole[] = ["fan", "band_admin", "venue_admin", "admin"];

export async function listUsers() {
  const users = await findAllUsers();
  return users.map((user) => ({
    ...user,
    userTypeCode: user.userType?.code ?? null,
    userType: undefined,
  }));
}

export async function setUserRole(userIdParam: string, role: unknown, requesterId: number) {
  const userId = Number(userIdParam);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new AppError("Invalid user id", 400);
  }

  if (typeof role !== "string" || !validRoles.includes(role as UserRole)) {
    throw new AppError(`role must be one of: ${validRoles.join(", ")}`, 400);
  }

  if (userId === requesterId) {
    throw new AppError("Admins cannot change their own role", 400);
  }

  const updated = await updateUserRole(userId, role as UserRole);
  return {
    ...updated,
    userTypeCode: updated.userType?.code ?? null,
    userType: undefined,
  };
}

export async function removeUser(userIdParam: string, requesterId: number) {
  const userId = Number(userIdParam);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new AppError("Invalid user id", 400);
  }

  if (userId === requesterId) {
    throw new AppError("Admins cannot delete themselves", 400);
  }

  await deleteUserById(userId);
}
