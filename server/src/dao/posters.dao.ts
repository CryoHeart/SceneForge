import { prisma } from "../prisma/client";

type PosterListFilters = {
  skip: number;
  take: number;
};

type UpsertPosterPayload = {
  eventId: number;
  imageUrl: string;
  cloudinaryId: string;
  uploadedById?: number;
};

export async function findPosters(filters: PosterListFilters) {
  return prisma.poster.findMany({
    include: {
      event: { include: { venue: true, bands: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: filters.skip,
    take: filters.take,
  });
}

export async function countPosters() {
  return prisma.poster.count();
}

export async function upsertPoster(payload: UpsertPosterPayload) {
  return prisma.poster.upsert({
    where: { eventId: payload.eventId },
    update: {
      imageUrl: payload.imageUrl,
      cloudinaryId: payload.cloudinaryId,
      uploadedById: payload.uploadedById,
    },
    create: {
      eventId: payload.eventId,
      imageUrl: payload.imageUrl,
      cloudinaryId: payload.cloudinaryId,
      uploadedById: payload.uploadedById,
    },
  });
}
