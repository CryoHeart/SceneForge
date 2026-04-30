import type { UserRole } from "@prisma/client";

export interface AuthedUser {
  id: string;
  role: UserRole;
}
