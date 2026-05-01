import { Request, Response } from "express";
import { listUsers, removeUser, setUserRole } from "../logic/admin.logic";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const adminController = {
  getUsers: asyncHandler(async (_req: Request, res: Response) => {
    const users = await listUsers();
    res.status(200).json(users);
  }),

  updateUserRole: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const updated = await setUserRole(String(req.params.id), req.body.role, req.user.id);
    res.status(200).json(updated);
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await removeUser(String(req.params.id), req.user.id);
    res.status(204).send();
  }),
};
