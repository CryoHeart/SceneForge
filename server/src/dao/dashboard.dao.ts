import { prisma } from "../prisma/client";

type DashboardEventsFilters = {
  createdById?: number;
};

type CreateEventPayload = {
  title: string;
  slug: string;
  description: string;
  city: string;
  genre: string;
  startsAt: Date;
  price: number;
  ticketUrl?: string;
  venueId: number;
  createdById: number;
  bandIds: number[];
};

type UpdateEventPayload = {
  title?: string;
  description?: string;
  city?: string;
  genre?: string;
  startsAt?: Date;
  price?: number;
  ticketUrl?: string;
  venueId?: number;
  bandIds?: number[];
};

export async function findDashboardEvents(filters: DashboardEventsFilters) {
  return prisma.event.findMany({
    where: filters.createdById ? { createdById: filters.createdById } : undefined,
    include: { venue: true, bands: true, poster: true },
    orderBy: { startsAt: "desc" },
  });
}

export async function findEventById(id: number) {
  return prisma.event.findUnique({ where: { id } });
}

export async function createDashboardEvent(payload: CreateEventPayload) {
  return prisma.event.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      city: payload.city,
      genre: payload.genre,
      startsAt: payload.startsAt,
      price: payload.price,
      ticketUrl: payload.ticketUrl,
      venueId: payload.venueId,
      createdById: payload.createdById,
      bands: {
        connect: payload.bandIds.map((id) => ({ id })),
      },
    },
    include: { venue: true, bands: true, poster: true },
  });
}

export async function updateDashboardEvent(id: number, payload: UpdateEventPayload) {
  return prisma.event.update({
    where: { id },
    data: {
      title: payload.title,
      description: payload.description,
      city: payload.city,
      genre: payload.genre,
      startsAt: payload.startsAt,
      price: payload.price,
      ticketUrl: payload.ticketUrl,
      venueId: payload.venueId,
      bands: payload.bandIds
        ? {
            set: [],
            connect: payload.bandIds.map((bandId) => ({ id: bandId })),
          }
        : undefined,
    },
    include: { venue: true, bands: true, poster: true },
  });
}
