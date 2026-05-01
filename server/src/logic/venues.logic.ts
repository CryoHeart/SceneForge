import { countVenues, findAllVenuesLight, findVenueByAdminId, findVenueById, findVenues, updateVenue } from "../dao/venues.dao";
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

export async function getMyVenue(adminId: number) {
  const venue = await findVenueByAdminId(adminId);
  if (!venue) {
    throw new AppError("No venue associated with your account", 404);
  }
  return venue;
}

export async function getManagedVenues(userId: number, isAdmin: boolean) {
  if (isAdmin) {
    return findAllVenuesLight();
  }
  const venue = await findVenueByAdminId(userId);
  return venue ? [venue] : [];
}

export async function updateVenueProfile(
  venueIdParam: string,
  userId: number,
  isAdmin: boolean,
  body: Record<string, unknown>,
) {
  const venueId = Number(venueIdParam);
  if (!Number.isInteger(venueId) || venueId < 1) {
    throw new AppError("Invalid venue id", 400);
  }

  if (!isAdmin) {
    const owned = await findVenueByAdminId(userId);
    if (!owned || owned.id !== venueId) {
      throw new AppError("Forbidden", 403);
    }
  }

  const name = typeof body.name === "string" ? body.name.trim() || undefined : undefined;
  const description = typeof body.description === "string" ? body.description.trim() || undefined : undefined;
  const address = typeof body.address === "string" ? body.address.trim() || undefined : undefined;
  const city = typeof body.city === "string" ? body.city.trim() || undefined : undefined;
  const capacity =
    body.capacity !== undefined && !Number.isNaN(Number(body.capacity)) && Number(body.capacity) > 0
      ? Number(body.capacity)
      : undefined;

  return updateVenue(venueId, { name, description, address, city, capacity });
}
