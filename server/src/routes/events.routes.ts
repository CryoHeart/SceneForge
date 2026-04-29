import { Router } from "express";
import { eventsController } from "../controllers/events.controller";

const eventsRouter = Router();

eventsRouter.get("/", eventsController.getEvents);
eventsRouter.get("/:id", eventsController.getEventById);

export { eventsRouter };
