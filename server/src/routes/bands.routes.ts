import { Router } from "express";
import { bandsController } from "../controllers/bands.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { UserRole } from "@prisma/client";

const bandsRouter = Router();

const managedRoles = [UserRole.band_admin, UserRole.admin];

bandsRouter.get("/", bandsController.getBands);
bandsRouter.get("/managed", authMiddleware, roleMiddleware(managedRoles), bandsController.getManagedBands);
bandsRouter.patch("/:id/profile", authMiddleware, roleMiddleware(managedRoles), bandsController.updateBandProfile);
bandsRouter.get("/:id", bandsController.getBandById);

export { bandsRouter };
