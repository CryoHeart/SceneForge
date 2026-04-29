import { prisma } from "../prisma/client";

export async function findSavedEventsByUser(userId: number) {
  return prisma.savedEvent.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          venue: true,
          bands: true,
          poster: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertSavedEvent(userId: number, eventId: number) {
  return prisma.savedEvent.upsert({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
    update: {},
    create: {
      userId,
      eventId,
    },
  });
}

export async function deleteSavedEvent(userId: number, eventId: number) {
  return prisma.savedEvent.delete({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });
}
