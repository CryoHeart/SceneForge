import { Request, Response } from "express";
import { getSavedEvents, removeSavedEvent, saveEvent } from "../logic/savedEvents.logic";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const savedEventsController = {
  getSavedEvents: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await getSavedEvents(req.user.id);
    res.status(200).json(result);
  }),

  saveEvent: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await saveEvent(req.body, req.user.id);
    res.status(201).json(result);
  }),

  removeSavedEvent: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await removeSavedEvent(String(req.params.eventId), req.user.id);
    res.status(204).send();
  }),
};
