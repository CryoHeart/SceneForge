import { countEvents, findEventById, findEvents } from "../dao/events.dao";
import { EventsQuery } from "../types/api";
import { AppError } from "../utils/appError";
import { parsePagination } from "../utils/pagination";

export async function getEvents(query: EventsQuery) {
  const { page, limit, skip } = parsePagination(query.page, query.limit);

  const venueId = query.venueId ? Number(query.venueId) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

  if (query.venueId && (!Number.isInteger(venueId) || (venueId ?? 0) < 1)) {
    throw new AppError("venueId must be a positive integer", 400);
  }

  if (query.maxPrice && (Number.isNaN(maxPrice) || (maxPrice ?? 0) < 0)) {
    throw new AppError("maxPrice must be a non-negative number", 400);
  }

  let date: Date | undefined;
  if (query.date) {
    date = new Date(query.date);
    if (Number.isNaN(date.getTime())) {
      throw new AppError("date must be a valid date", 400);
    }
  }

  const filters = {
    city: query.city?.trim(),
    genre: query.genre?.trim(),
    date,
    venueId,
    maxPrice,
    skip,
    take: limit,
  };

  const [data, total] = await Promise.all([findEvents(filters), countEvents(filters)]);

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

export async function getEventById(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Invalid event id", 400);
  }

  const event = await findEventById(id);
  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
}
