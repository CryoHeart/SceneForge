import { Request, Response } from "express";
import { getBandById, getBands, getManagedBands, updateBandProfile } from "../logic/bands.logic";
import { BandsQuery } from "../types/api";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { resolveUserTypeCode } from "../utils/userType";

export const bandsController = {
  getBands: asyncHandler(async (req: Request, res: Response) => {
    const result = await getBands(req.query as unknown as BandsQuery);
    res.status(200).json(result);
  }),

  getBandById: asyncHandler(async (req: Request, res: Response) => {
    const result = await getBandById(String(req.params.id));
    res.status(200).json(result);
  }),

  getManagedBands: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const isAdmin = resolveUserTypeCode(req.user.role, req.user.userTypeCode) === "ADMIN";
    const result = await getManagedBands(req.user.id, isAdmin);
    res.status(200).json(result);
  }),

  updateBandProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const isAdmin = resolveUserTypeCode(req.user.role, req.user.userTypeCode) === "ADMIN";
    const result = await updateBandProfile(
      String(req.params.id),
      req.user.id,
      isAdmin,
      req.body as Record<string, unknown>,
    );
    res.status(200).json(result);
  }),
};
