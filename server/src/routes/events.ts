import { Router } from "express";
import { eventController } from "../controllers/eventController.js";
import { validateParams, validateQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../validators/common.js";
import { eventListQuerySchema } from "../validators/events.js";

const router = Router();

router.get("/", validateQuery(eventListQuerySchema), asyncHandler(eventController.list));
router.get("/:id", validateParams(idParamSchema), asyncHandler(eventController.getById));

export default router;
