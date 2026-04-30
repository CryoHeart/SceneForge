import type { Request, Response } from "express";
import { eventService } from "../services/eventService.js";

export const eventController = {
  async list(req: Request, res: Response) {
    const result = await eventService.list(req.query as unknown as Parameters<typeof eventService.list>[0]);
    res.status(200).json(result);
  },

  async getById(req: Request, res: Response) {
    const result = await eventService.getById(req.params.id);
    res.status(200).json(result);
  },
};
