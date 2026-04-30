import { Router } from "express";
import { savedEventController } from "../controllers/savedEventController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { eventIdParamSchema } from "../validators/common.js";
import { createSavedEventSchema } from "../validators/savedEvents.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(savedEventController.list));
router.post("/", validateBody(createSavedEventSchema), asyncHandler(savedEventController.create));
router.delete("/:eventId", validateParams(eventIdParamSchema), asyncHandler(savedEventController.remove));

export default router;
