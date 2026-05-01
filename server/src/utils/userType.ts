import { UserRole } from "@prisma/client";

export const USER_TYPE_CODES = ["USER", "BAND_ADMIN", "VENUE_ADMIN", "ADMIN"] as const;

export type UserTypeCode = (typeof USER_TYPE_CODES)[number];

const roleToUserTypeCodeMap: Record<UserRole, UserTypeCode> = {
  fan: "USER",
  band_admin: "BAND_ADMIN",
  venue_admin: "VENUE_ADMIN",
  admin: "ADMIN",
};

const userTypeCodeToRoleMap: Record<UserTypeCode, UserRole> = {
  USER: UserRole.fan,
  BAND_ADMIN: UserRole.band_admin,
  VENUE_ADMIN: UserRole.venue_admin,
  ADMIN: UserRole.admin,
};

export function roleToUserTypeCode(role: UserRole): UserTypeCode {
  return roleToUserTypeCodeMap[role];
}

export function normalizeUserTypeCode(code?: string | null): UserTypeCode | undefined {
  if (!code) {
    return undefined;
  }

  const normalized = code.toUpperCase();
  return USER_TYPE_CODES.find((candidate) => candidate === normalized);
}

export function userTypeCodeToRole(code: string): UserRole | undefined {
  const normalized = normalizeUserTypeCode(code);
  if (!normalized) {
    return undefined;
  }

  return userTypeCodeToRoleMap[normalized];
}

export function resolveUserTypeCode(role: UserRole, code?: string | null): UserTypeCode {
  return normalizeUserTypeCode(code) ?? roleToUserTypeCode(role);
}

export function hasRole(
  allowedRoles: UserRole[],
  user: { role: UserRole; userTypeCode?: string | null }
): boolean {
  const allowedUserTypeCodes = allowedRoles.map((role) => roleToUserTypeCode(role));
  const effectiveUserTypeCode = resolveUserTypeCode(user.role, user.userTypeCode);
  return allowedUserTypeCodes.includes(effectiveUserTypeCode);
}

export function isManagerUserTypeCode(code: string): boolean {
  const normalized = normalizeUserTypeCode(code);
  return normalized === "ADMIN" || normalized === "BAND_ADMIN" || normalized === "VENUE_ADMIN";
}
