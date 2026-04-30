import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roles.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema, paginationQuerySchema } from "../validators/common.js";
import { dashboardEventSchema, dashboardEventUpdateSchema } from "../validators/events.js";

const router = Router();

router.use(requireAuth, requireRoles("admin", "band_admin", "venue_admin"));

router.get("/events", validateQuery(paginationQuerySchema), asyncHandler(dashboardController.listEvents));
router.post("/events", validateBody(dashboardEventSchema), asyncHandler(dashboardController.createEvent));
router.put(
  "/events/:id",
  validateParams(idParamSchema),
  validateBody(dashboardEventUpdateSchema),
  asyncHandler(dashboardController.updateEvent),
);

export default router;
