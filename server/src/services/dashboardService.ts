import type { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { uploadPosterMock } from "./mockUploader.js";
import { AppError } from "../utils/appError.js";
import { buildPagination, buildPaginationMeta } from "../utils/pagination.js";

interface DashboardUser {
  id: string;
  role: UserRole;
}

interface DashboardEventPayload {
  title: string;
  city: string;
  genre: string;
  description: string;
  date: string;
  price: number;
  ticketUrl?: string;
  venueId: string;
  bandIds: string[];
  posterFileName?: string;
}

const assertRolePermission = async (user: DashboardUser, payload: Partial<DashboardEventPayload>) => {
  if (user.role === "admin") {
    return;
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { bandId: true, venueId: true },
  });

  if (!fullUser) {
    throw new AppError(401, "User not found", "USER_NOT_FOUND");
  }

  if (user.role === "band_admin") {
    const ownsBand = !!fullUser.bandId && payload.bandIds?.includes(fullUser.bandId);
    if (!ownsBand) {
      throw new AppError(
        403,
        "Band admins can only manage events that include their own band",
        "FORBIDDEN_BAND_SCOPE",
      );
    }
  }

  if (user.role === "venue_admin") {
    const ownsVenue = !!fullUser.venueId && payload.venueId === fullUser.venueId;
    if (!ownsVenue) {
      throw new AppError(
        403,
        "Venue admins can only manage events at their assigned venue",
        "FORBIDDEN_VENUE_SCOPE",
      );
    }
  }
};

export const dashboardService = {
  async listEvents(page: number, limit: number) {
    const { skip, take } = buildPagination({ page, limit });

    const [total, data] = await Promise.all([
      prisma.event.count(),
      prisma.event.findMany({
        include: { venue: true, bands: { include: { band: true } }, posters: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data,
      pagination: buildPaginationMeta({ page, limit, total }),
    };
  },

  async createEvent(user: DashboardUser, payload: DashboardEventPayload) {
    await assertRolePermission(user, payload);

    const created = await prisma.event.create({
      data: {
        title: payload.title,
        city: payload.city,
        genre: payload.genre,
        description: payload.description,
        date: new Date(payload.date),
        price: payload.price,
        ticketUrl: payload.ticketUrl,
        venueId: payload.venueId,
        bands: {
          create: payload.bandIds.map((bandId) => ({ bandId })),
        },
      },
    });

    if (payload.posterFileName) {
      const upload = await uploadPosterMock(payload.posterFileName);
      await prisma.poster.create({
        data: {
          imageUrl: upload.secureUrl,
          eventId: created.id,
          caption: created.title,
        },
      });
    }

    return prisma.event.findUnique({
      where: { id: created.id },
      include: { venue: true, bands: { include: { band: true } }, posters: true },
    });
  },

  async updateEvent(id: string, user: DashboardUser, payload: Partial<DashboardEventPayload>) {
    const existing = await prisma.event.findUnique({
      where: { id },
      include: { bands: true },
    });

    if (!existing) {
      throw new AppError(404, "Event not found", "EVENT_NOT_FOUND");
    }

    await assertRolePermission(user, {
      venueId: payload.venueId ?? existing.venueId,
      bandIds:
        payload.bandIds ??
        existing.bands.map((band) => band.bandId),
    });

    await prisma.event.update({
      where: { id },
      data: {
        title: payload.title,
        city: payload.city,
        genre: payload.genre,
        description: payload.description,
        date: payload.date ? new Date(payload.date) : undefined,
        price: payload.price,
        ticketUrl: payload.ticketUrl,
        venueId: payload.venueId,
      },
    });

    if (payload.bandIds) {
      await prisma.eventBand.deleteMany({ where: { eventId: id } });
      if (payload.bandIds.length > 0) {
        await prisma.eventBand.createMany({
          data: payload.bandIds.map((bandId) => ({ eventId: id, bandId })),
          skipDuplicates: true,
        });
      }
    }

    if (payload.posterFileName) {
      const upload = await uploadPosterMock(payload.posterFileName);
      await prisma.poster.create({
        data: {
          imageUrl: upload.secureUrl,
          eventId: id,
          caption: payload.title,
        },
      });
    }

    return prisma.event.findUnique({
      where: { id },
      include: { venue: true, bands: { include: { band: true } }, posters: true },
    });
  },
};
