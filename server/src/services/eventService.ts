import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { buildPagination, buildPaginationMeta } from "../utils/pagination.js";

export interface EventListQuery {
  page: number;
  limit: number;
  city?: string;
  genre?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  venue?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
}

const buildDateFilter = (query: EventListQuery): Prisma.DateTimeFilter | undefined => {
  if (query.date) {
    const start = new Date(query.date);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { gte: start, lt: end };
  }

  if (query.dateFrom || query.dateTo) {
    return {
      gte: query.dateFrom ? new Date(query.dateFrom) : undefined,
      lte: query.dateTo ? new Date(query.dateTo) : undefined,
    };
  }

  return undefined;
};

const buildPriceFilter = (query: EventListQuery): Prisma.DecimalFilter | undefined => {
  const gte = query.priceMin;
  const lte = query.priceMax ?? query.price;

  if (gte === undefined && lte === undefined) {
    return undefined;
  }

  return { gte, lte };
};

export const eventService = {
  async list(query: EventListQuery) {
    const where: Prisma.EventWhereInput = {
      city: query.city ? { contains: query.city } : undefined,
      genre: query.genre ? { contains: query.genre } : undefined,
      date: buildDateFilter(query),
      venue: query.venue
        ? {
            name: { contains: query.venue },
          }
        : undefined,
      price: buildPriceFilter(query),
    };

    const { skip, take } = buildPagination({ page: query.page, limit: query.limit });

    const [total, data] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        include: {
          venue: true,
          posters: true,
          bands: { include: { band: true } },
        },
        orderBy: { date: "asc" },
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
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        posters: true,
        bands: { include: { band: true } },
        setlists: { include: { band: true } },
      },
    });

    if (!event) {
      throw new AppError(404, "Event not found", "EVENT_NOT_FOUND");
    }

    return event;
  },
};
