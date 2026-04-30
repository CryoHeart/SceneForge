import { Router } from "express";
import { bandController } from "../controllers/bandController.js";
import { validateParams, validateQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParamSchema } from "../validators/common.js";
import { bandListQuerySchema } from "../validators/bands.js";

const router = Router();

router.get("/", validateQuery(bandListQuerySchema), asyncHandler(bandController.list));
router.get("/:id", validateParams(idParamSchema), asyncHandler(bandController.getById));

export default router;
