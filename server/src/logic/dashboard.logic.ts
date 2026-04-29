import { UserRole } from "@prisma/client";
import {
  createDashboardEvent,
  findDashboardEvents,
  findEventById,
  updateDashboardEvent,
} from "../dao/dashboard.dao";
import { CreateEventInput, UpdateEventInput } from "../types/api";
import { AppError } from "../utils/appError";

type AuthUser = {
  id: number;
  role: UserRole;
};

function buildSlug(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function assertManagerRole(role: UserRole) {
  if (role !== UserRole.admin && role !== UserRole.band_admin && role !== UserRole.venue_admin) {
    throw new AppError("Forbidden", 403);
  }
}

export async function getDashboardEvents(user: AuthUser) {
  const isAdmin = user.role === UserRole.admin;
  return findDashboardEvents({ createdById: isAdmin ? undefined : user.id });
}

export async function createEvent(input: CreateEventInput, user: AuthUser) {
  assertManagerRole(user.role);

  const title = input.title?.trim();
  const description = input.description?.trim();
  const city = input.city?.trim();
  const genre = input.genre?.trim();
  const startsAt = input.startsAt ? new Date(input.startsAt) : undefined;
  const price = Number(input.price);
  const ticketUrl = input.ticketUrl?.trim();
  const venueId = Number(input.venueId);
  const bandIds = (input.bandIds ?? []).map((id) => Number(id));

  if (!title || !description || !city || !genre || !startsAt || Number.isNaN(startsAt.getTime())) {
    throw new AppError("title, description, city, genre and valid startsAt are required", 400);
  }

  if (Number.isNaN(price) || price < 0) {
    throw new AppError("price must be a non-negative number", 400);
  }

  if (!Number.isInteger(venueId) || venueId < 1) {
    throw new AppError("venueId must be a positive integer", 400);
  }

  if (!Array.isArray(bandIds) || !bandIds.every((id) => Number.isInteger(id) && id > 0)) {
    throw new AppError("bandIds must be an array of positive integers", 400);
  }

  return createDashboardEvent({
    title,
    slug: buildSlug(title),
    description,
    city,
    genre,
    startsAt,
    price,
    ticketUrl,
    venueId,
    createdById: user.id,
    bandIds,
  });
}

export async function editEvent(idParam: string, input: UpdateEventInput, user: AuthUser) {
  assertManagerRole(user.role);

  const eventId = Number(idParam);
  if (!Number.isInteger(eventId) || eventId < 1) {
    throw new AppError("Invalid event id", 400);
  }

  const existing = await findEventById(eventId);
  if (!existing) {
    throw new AppError("Event not found", 404);
  }

  if (user.role !== UserRole.admin && existing.createdById !== user.id) {
    throw new AppError("You can only edit events created by your account", 403);
  }

  const startsAt = input.startsAt ? new Date(input.startsAt) : undefined;
  if (input.startsAt && Number.isNaN(startsAt?.getTime())) {
    throw new AppError("startsAt must be a valid date", 400);
  }

  const parsedPrice = input.price !== undefined ? Number(input.price) : undefined;
  if (parsedPrice !== undefined && (Number.isNaN(parsedPrice) || parsedPrice < 0)) {
    throw new AppError("price must be a non-negative number", 400);
  }

  const parsedVenueId = input.venueId !== undefined ? Number(input.venueId) : undefined;
  if (parsedVenueId !== undefined && (!Number.isInteger(parsedVenueId) || parsedVenueId < 1)) {
    throw new AppError("venueId must be a positive integer", 400);
  }

  const parsedBandIds = input.bandIds?.map((id) => Number(id));
  if (
    parsedBandIds !== undefined &&
    (!Array.isArray(parsedBandIds) || !parsedBandIds.every((id) => Number.isInteger(id) && id > 0))
  ) {
    throw new AppError("bandIds must be an array of positive integers", 400);
  }

  return updateDashboardEvent(eventId, {
    title: input.title?.trim(),
    description: input.description?.trim(),
    city: input.city?.trim(),
    genre: input.genre?.trim(),
    startsAt,
    price: parsedPrice,
    ticketUrl: input.ticketUrl?.trim(),
    venueId: parsedVenueId,
    bandIds: parsedBandIds,
  });
}
