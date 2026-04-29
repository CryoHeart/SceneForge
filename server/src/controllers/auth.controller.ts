import { Request, Response } from "express";
import { login, register } from "../logic/auth.logic";
import { asyncHandler } from "../utils/asyncHandler";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await register(req.body);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req.body);
    res.status(200).json(result);
  }),
};
