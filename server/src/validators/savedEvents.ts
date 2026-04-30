import { z } from "zod";

export const createSavedEventSchema = z.object({
  eventId: z.string().min(1),
});
