import { countBands, findBandById, findBands } from "../dao/bands.dao";
import { BandsQuery } from "../types/api";
import { AppError } from "../utils/appError";
import { parsePagination } from "../utils/pagination";

export async function getBands(query: BandsQuery) {
  const { page, limit, skip } = parsePagination(query.page, query.limit);

  const filters = {
    q: query.q?.trim(),
    genre: query.genre?.trim(),
    skip,
    take: limit,
  };

  const [data, total] = await Promise.all([findBands(filters), countBands(filters)]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBandById(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Invalid band id", 400);
  }

  const band = await findBandById(id);
  if (!band) {
    throw new AppError("Band not found", 404);
  }

  return band;
}
