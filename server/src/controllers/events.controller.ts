import { Request, Response } from "express";
import { getEventById, getEvents } from "../logic/events.logic";
import { EventsQuery } from "../types/api";
import { asyncHandler } from "../utils/asyncHandler";

export const eventsController = {
  getEvents: asyncHandler(async (req: Request, res: Response) => {
    const result = await getEvents(req.query as unknown as EventsQuery);
    res.status(200).json(result);
  }),

  getEventById: asyncHandler(async (req: Request, res: Response) => {
    const result = await getEventById(String(req.params.id));
    res.status(200).json(result);
  }),
};
