import { Router } from "express";
import { savedEventsController } from "../controllers/savedEvents.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const savedEventsRouter = Router();

savedEventsRouter.use(authMiddleware);

savedEventsRouter.get("/", savedEventsController.getSavedEvents);
savedEventsRouter.post("/", savedEventsController.saveEvent);
savedEventsRouter.delete("/:eventId", savedEventsController.removeSavedEvent);

export { savedEventsRouter };
