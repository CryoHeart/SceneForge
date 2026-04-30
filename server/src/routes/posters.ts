import { Router } from "express";
import { posterController } from "../controllers/posterController.js";
import { validateQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { posterListQuerySchema } from "../validators/posters.js";

const router = Router();

router.get("/", validateQuery(posterListQuerySchema), asyncHandler(posterController.list));

export default router;
