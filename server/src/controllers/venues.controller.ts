import { Request, Response } from "express";
import { getVenueById, getVenues } from "../logic/venues.logic";
import { VenuesQuery } from "../types/api";
import { asyncHandler } from "../utils/asyncHandler";

export const venuesController = {
  getVenues: asyncHandler(async (req: Request, res: Response) => {
    const result = await getVenues(req.query as unknown as VenuesQuery);
    res.status(200).json(result);
  }),

  getVenueById: asyncHandler(async (req: Request, res: Response) => {
    const result = await getVenueById(String(req.params.id));
    res.status(200).json(result);
  }),
};
