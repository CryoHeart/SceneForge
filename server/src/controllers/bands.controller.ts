import { Request, Response } from "express";
import { getBandById, getBands } from "../logic/bands.logic";
import { BandsQuery } from "../types/api";
import { asyncHandler } from "../utils/asyncHandler";

export const bandsController = {
  getBands: asyncHandler(async (req: Request, res: Response) => {
    const result = await getBands(req.query as unknown as BandsQuery);
    res.status(200).json(result);
  }),

  getBandById: asyncHandler(async (req: Request, res: Response) => {
    const result = await getBandById(String(req.params.id));
    res.status(200).json(result);
  }),
};
