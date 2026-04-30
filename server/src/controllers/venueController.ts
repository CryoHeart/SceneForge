import type { Request, Response } from "express";
import { venueService } from "../services/venueService.js";

export const venueController = {
  async list(req: Request, res: Response) {
    const result = await venueService.list(req.query as unknown as Parameters<typeof venueService.list>[0]);
    res.status(200).json(result);
  },

  async getById(req: Request, res: Response) {
    const result = await venueService.getById(req.params.id);
    res.status(200).json(result);
  },
};
