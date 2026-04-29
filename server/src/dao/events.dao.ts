import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

type EventListFilters = {
  city?: string;
  genre?: string;
  date?: Date;
  venueId?: number;
  maxPrice?: number;
  skip: number;
  take: number;
};

const eventListInclude = {
  venue: true,
  bands: true,
  poster: true,
} as const;

const eventDetailsInclude = {
  ...eventListInclude,
  setlists: { include: { band: true } },
} as const;

function buildWhere(filters: EventListFilters): Prisma.EventWhereInput {
  return {
    city: filters.city ? { contains: filters.city } : undefined,
    genre: filters.genre ? { contains: filters.genre } : undefined,
    venueId: filters.venueId,
    price: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
    startsAt: filters.date
      ? {
          gte: new Date(new Date(filters.date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(filters.date).setHours(23, 59, 59, 999)),
        }
      : undefined,
  };
}

export async function findEvents(filters: EventListFilters) {
  return prisma.event.findMany({
    where: buildWhere(filters),
    include: eventListInclude,
    orderBy: { startsAt: "asc" },
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countEvents(filters: EventListFilters) {
  return prisma.event.count({
    where: buildWhere(filters),
  });
}

export async function findEventById(id: number) {
  return prisma.event.findUnique({
    where: { id },
    include: eventDetailsInclude,
  });
}
