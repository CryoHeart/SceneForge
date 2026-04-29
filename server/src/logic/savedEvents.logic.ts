import { deleteSavedEvent, findSavedEventsByUser, upsertSavedEvent } from "../dao/savedEvents.dao";
import { SaveEventInput } from "../types/api";
import { AppError } from "../utils/appError";

export async function getSavedEvents(userId: number) {
  return findSavedEventsByUser(userId);
}

export async function saveEvent(input: SaveEventInput, userId: number) {
  const eventId = Number(input.eventId);

  if (!Number.isInteger(eventId) || eventId < 1) {
    throw new AppError("eventId is required", 400);
  }

  return upsertSavedEvent(userId, eventId);
}

export async function removeSavedEvent(eventIdParam: string, userId: number) {
  const eventId = Number(eventIdParam);
  if (!Number.isInteger(eventId) || eventId < 1) {
    throw new AppError("Invalid event id", 400);
  }

  await deleteSavedEvent(userId, eventId);
}
