import type { Request, Response } from "express";
import { bandService } from "../services/bandService.js";

export const bandController = {
  async list(req: Request, res: Response) {
    const result = await bandService.list(req.query as unknown as Parameters<typeof bandService.list>[0]);
    res.status(200).json(result);
  },

  async getById(req: Request, res: Response) {
    const result = await bandService.getById(req.params.id);
    res.status(200).json(result);
  },
};
