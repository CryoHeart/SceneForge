import { Router } from "express";
import { bandsController } from "../controllers/bands.controller";

const bandsRouter = Router();

bandsRouter.get("/", bandsController.getBands);
bandsRouter.get("/:id", bandsController.getBandById);

export { bandsRouter };
