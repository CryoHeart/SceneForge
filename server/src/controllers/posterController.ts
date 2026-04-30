import type { Request, Response } from "express";
import { posterService } from "../services/posterService.js";

export const posterController = {
  async list(req: Request, res: Response) {
    const result = await posterService.list(req.query as unknown as Parameters<typeof posterService.list>[0]);
    res.status(200).json(result);
  },
};
