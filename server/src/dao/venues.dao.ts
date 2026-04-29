import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

type VenueListFilters = {
  q?: string;
  city?: string;
  skip: number;
  take: number;
};

function buildWhere(filters: VenueListFilters): Prisma.VenueWhereInput {
  return {
    name: filters.q ? { contains: filters.q } : undefined,
    city: filters.city ? { contains: filters.city } : undefined,
  };
}

export async function findVenues(filters: VenueListFilters) {
  return prisma.venue.findMany({
    where: buildWhere(filters),
    orderBy: { name: "asc" },
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countVenues(filters: VenueListFilters) {
  return prisma.venue.count({ where: buildWhere(filters) });
}

export async function findVenueById(id: number) {
  return prisma.venue.findUnique({
    where: { id },
    include: {
      events: {
        include: { bands: true, poster: true },
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
      },
    },
  });
}
