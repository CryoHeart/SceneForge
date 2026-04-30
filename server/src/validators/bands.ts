import { z } from "zod";
import { paginationQuerySchema } from "./common.js";

export const bandListQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().min(1).optional(),
  genre: z.string().trim().min(1).optional(),
});
