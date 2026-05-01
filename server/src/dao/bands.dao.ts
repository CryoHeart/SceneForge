import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

type BandListFilters = {
  q?: string;
  genre?: string;
  skip: number;
  take: number;
};

function buildWhere(filters: BandListFilters): Prisma.BandWhereInput {
  return {
    name: filters.q ? { contains: filters.q } : undefined,
    genreTags: filters.genre ? { contains: filters.genre } : undefined,
  };
}

export async function findBands(filters: BandListFilters) {
  return prisma.band.findMany({
    where: buildWhere(filters),
    orderBy: { name: "asc" },
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countBands(filters: BandListFilters) {
  return prisma.band.count({ where: buildWhere(filters) });
}

export async function findBandById(id: number) {
  return prisma.band.findUnique({
    where: { id },
    include: {
      events: {
        include: { venue: true, poster: true },
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
      },
    },
  });
}

export async function findBandByAdminId(adminId: number) {
  return prisma.band.findFirst({ where: { adminId } });
}

export async function findAllBandsLight() {
  return prisma.band.findMany({ orderBy: { name: "asc" } });
}

export async function updateBand(
  id: number,
  data: { name?: string; bio?: string; city?: string; genreTags?: string; linksJson?: Record<string, string> },
) {
  return prisma.band.update({ where: { id }, data });
}
