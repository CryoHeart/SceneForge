import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { buildPagination, buildPaginationMeta } from "../utils/pagination.js";

interface VenueListQuery {
  page: number;
  limit: number;
  city?: string;
  q?: string;
}

export const venueService = {
  async list(query: VenueListQuery) {
    const where = {
      city: query.city ? { contains: query.city } : undefined,
      name: query.q ? { contains: query.q } : undefined,
    };

    const { skip, take } = buildPagination({ page: query.page, limit: query.limit });

    const [total, data] = await Promise.all([
      prisma.venue.count({ where }),
      prisma.venue.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take,
      }),
    ]);

    return {
      data,
      pagination: buildPaginationMeta({ page: query.page, limit: query.limit, total }),
    };
  },

  async getById(id: string) {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: { events: true },
    });

    if (!venue) {
      throw new AppError(404, "Venue not found", "VENUE_NOT_FOUND");
    }

    return venue;
  },
};
