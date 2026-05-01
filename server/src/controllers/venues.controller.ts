import { Request, Response } from "express";
import { getVenueById, getVenues, getManagedVenues, updateVenueProfile } from "../logic/venues.logic";
import { VenuesQuery } from "../types/api";
import { AppError } from "../utils/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { resolveUserTypeCode } from "../utils/userType";

export const venuesController = {
  getVenues: asyncHandler(async (req: Request, res: Response) => {
    const result = await getVenues(req.query as unknown as VenuesQuery);
    res.status(200).json(result);
  }),

  getVenueById: asyncHandler(async (req: Request, res: Response) => {
    const result = await getVenueById(String(req.params.id));
    res.status(200).json(result);
  }),

  getManagedVenues: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const isAdmin = resolveUserTypeCode(req.user.role, req.user.userTypeCode) === "ADMIN";
    const result = await getManagedVenues(req.user.id, isAdmin);
    res.status(200).json(result);
  }),

  updateVenueProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const isAdmin = resolveUserTypeCode(req.user.role, req.user.userTypeCode) === "ADMIN";
    const result = await updateVenueProfile(
      String(req.params.id),
      req.user.id,
      isAdmin,
      req.body as Record<string, unknown>,
    );
    res.status(200).json(result);
  }),
};
