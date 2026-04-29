import { Request, Response } from "express";
import { getPosters, uploadPoster } from "../logic/posters.logic";
import { PostersQuery } from "../types/api";
import { asyncHandler } from "../utils/asyncHandler";

export const postersController = {
  getPosters: asyncHandler(async (req: Request, res: Response) => {
    const result = await getPosters(req.query as unknown as PostersQuery);
    res.status(200).json(result);
  }),

  uploadPoster: asyncHandler(async (req: Request, res: Response) => {
    const result = await uploadPoster(req.body, req.user?.id);
    res.status(201).json(result);
  }),
};
