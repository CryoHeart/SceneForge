import { z } from "zod";
import { paginationQuerySchema } from "./common.js";

export const venueListQuerySchema = paginationQuerySchema.extend({
  city: z.string().trim().min(1).optional(),
  q: z.string().trim().min(1).optional(),
});
