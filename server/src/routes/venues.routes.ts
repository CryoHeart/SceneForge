import { Router } from "express";
import { venuesController } from "../controllers/venues.controller";

const venuesRouter = Router();

venuesRouter.get("/", venuesController.getVenues);
venuesRouter.get("/:id", venuesController.getVenueById);

export { venuesRouter };
