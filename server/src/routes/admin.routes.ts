import { UserRole } from "@prisma/client";
import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const adminRouter = Router();

adminRouter.use(authMiddleware);
adminRouter.use(roleMiddleware([UserRole.admin]));

adminRouter.get("/users", adminController.getUsers);
adminRouter.patch("/users/:id/role", adminController.updateUserRole);
adminRouter.delete("/users/:id", adminController.deleteUser);

export { adminRouter };
