import { UserRole } from "@prisma/client";
import { UserTypeCode } from "../../utils/userType";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
        userTypeCode?: UserTypeCode;
      };
    }
  }
}

export {};
