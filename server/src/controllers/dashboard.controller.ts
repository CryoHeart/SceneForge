import { Request, Response } from "express";
import { createEvent, editEvent, getDashboardEvents } from "../logic/dashboard.logic";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const dashboardController = {
  getEvents: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await getDashboardEvents(req.user);
    res.status(200).json(result);
  }),

  createEvent: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await createEvent(req.body, req.user);
    res.status(201).json(result);
  }),

  updateEvent: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await editEvent(String(req.params.id), req.body, req.user);
    res.status(200).json(result);
  }),
};
