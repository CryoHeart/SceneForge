import { countVenues, findVenueById, findVenues } from "../dao/venues.dao";
import { AppError } from "../utils/appError";
import { parsePagination } from "../utils/pagination";
import { VenuesQuery } from "../types/api";

export async function getVenues(query: VenuesQuery) {
  const { page, limit, skip } = parsePagination(query.page, query.limit);

  const filters = {
    q: query.q?.trim(),
    city: query.city?.trim(),
    skip,
    take: limit,
  };

  const [data, total] = await Promise.all([findVenues(filters), countVenues(filters)]);

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

export async function getVenueById(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Invalid venue id", 400);
  }

  const venue = await findVenueById(id);
  if (!venue) {
    throw new AppError("Venue not found", 404);
  }

  return venue;
}
