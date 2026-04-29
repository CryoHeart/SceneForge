import { Router } from "express";
import { postersController } from "../controllers/posters.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const postersRouter = Router();

postersRouter.get("/", postersController.getPosters);
postersRouter.post("/", authMiddleware, postersController.uploadPoster);

export { postersRouter };
