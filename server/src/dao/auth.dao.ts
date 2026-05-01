import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../prisma/client";
import { normalizeUserTypeCode, roleToUserTypeCode } from "../utils/userType";

type CreateUserPayload = {
  email: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
};

export type AuthUserWithType = Prisma.UserGetPayload<{
  include: { userType: { select: { code: true } } };
}>;

export type AuthUserRecord = Omit<AuthUserWithType, "userType"> & {
  userTypeCode?: string | null;
};

function mapAuthUserRecord(user: AuthUserWithType): AuthUserRecord {
  return {
    ...user,
    userTypeCode: user.userType?.code,
  };
}

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { userType: { select: { code: true } } },
  });

  return user ? mapAuthUserRecord(user) : null;
}

export async function createUser(payload: CreateUserPayload): Promise<AuthUserRecord> {
  const user = await prisma.user.create({
    data: {
      ...payload,
      userType: {
        connect: {
          code: roleToUserTypeCode(payload.role),
        },
      },
    },
    include: { userType: { select: { code: true } } },
  });

  return mapAuthUserRecord(user);
}

export async function syncUserRoleAndType(params: {
  userId: number;
  role: UserRole;
  userTypeCode?: string | null;
}): Promise<AuthUserRecord | null> {
  const expectedUserTypeCode = roleToUserTypeCode(params.role);
  const currentUserTypeCode = normalizeUserTypeCode(params.userTypeCode);

  if (currentUserTypeCode === expectedUserTypeCode) {
    return null;
  }

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      role: params.role,
      userType: {
        connect: {
          code: expectedUserTypeCode,
        },
      },
    },
    include: { userType: { select: { code: true } } },
  });

  return mapAuthUserRecord(user);
}
