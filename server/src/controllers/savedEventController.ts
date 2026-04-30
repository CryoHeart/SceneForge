import type { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { savedEventService } from "../services/savedEventService.js";

const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new AppError(401, "Authentication required", "UNAUTHORIZED");
  }

  return req.user.id;
};

export const savedEventController = {
  async list(req: Request, res: Response) {
    const data = await savedEventService.listByUser(getUserId(req));
    res.status(200).json(data);
  },

  async create(req: Request, res: Response) {
    const result = await savedEventService.save(getUserId(req), req.body.eventId);
    res.status(201).json(result);
  },

  async remove(req: Request, res: Response) {
    await savedEventService.remove(getUserId(req), req.params.eventId);
    res.status(204).send();
  },
};
