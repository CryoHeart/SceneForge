import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";

export const savedEventService = {
  async listByUser(userId: string) {
    return prisma.savedEvent.findMany({
      where: { userId },
      include: { event: { include: { venue: true, posters: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async save(userId: string, eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) {
      throw new AppError(404, "Event not found", "EVENT_NOT_FOUND");
    }

    return prisma.savedEvent.upsert({
      where: { userId_eventId: { userId, eventId } },
      create: { userId, eventId },
      update: {},
    });
  },

  async remove(userId: string, eventId: string) {
    try {
      await prisma.savedEvent.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch {
      throw new AppError(404, "Saved event not found", "SAVED_EVENT_NOT_FOUND");
    }
  },
};
