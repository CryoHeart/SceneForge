import { Router } from "express";
import { venueController } from "../controllers/venueController.js";
import { validateParams, validateQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../validators/common.js";
import { venueListQuerySchema } from "../validators/venues.js";

const router = Router();

router.get("/", validateQuery(venueListQuerySchema), asyncHandler(venueController.list));
router.get("/:id", validateParams(idParamSchema), asyncHandler(venueController.getById));

export default router;
