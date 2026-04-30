import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { dashboardService } from "../services/dashboardService.js";

const getAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required", "UNAUTHORIZED");
  }

  return req.user;
};

export const dashboardController = {
  async listEvents(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await dashboardService.listEvents(page, limit);
    res.status(200).json(result);
  },

  async createEvent(req: Request, res: Response) {
    const user = getAuthenticatedUser(req);
    const result = await dashboardService.createEvent(user, req.body);
    res.status(201).json(result);
  },

  async updateEvent(req: Request, res: Response) {
    const user = getAuthenticatedUser(req);
    const result = await dashboardService.updateEvent(req.params.id, user, req.body);
    res.status(200).json(result);
  },
};
