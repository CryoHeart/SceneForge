import { Router } from "express";
import { venuesController } from "../controllers/venues.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { UserRole } from "@prisma/client";

const venuesRouter = Router();

const managedRoles = [UserRole.venue_admin, UserRole.admin];

venuesRouter.get("/", venuesController.getVenues);
venuesRouter.get("/managed", authMiddleware, roleMiddleware(managedRoles), venuesController.getManagedVenues);
venuesRouter.patch("/:id/profile", authMiddleware, roleMiddleware(managedRoles), venuesController.updateVenueProfile);
venuesRouter.get("/:id", venuesController.getVenueById);

export { venuesRouter };
