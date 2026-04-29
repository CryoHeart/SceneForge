import { UserRole } from "@prisma/client";
import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get("/events", dashboardController.getEvents);
dashboardRouter.post(
  "/events",
  roleMiddleware([UserRole.admin, UserRole.band_admin, UserRole.venue_admin]),
  dashboardController.createEvent
);
dashboardRouter.put(
  "/events/:id",
  roleMiddleware([UserRole.admin, UserRole.band_admin, UserRole.venue_admin]),
  dashboardController.updateEvent
);

export { dashboardRouter };
