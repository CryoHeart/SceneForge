import { z } from "zod";
import { paginationQuerySchema } from "./common.js";

export const eventListQuerySchema = paginationQuerySchema.extend({
  city: z.string().trim().min(1).optional(),
  genre: z.string().trim().min(1).optional(),
  date: z.string().trim().min(1).optional(),
  dateFrom: z.string().trim().min(1).optional(),
  dateTo: z.string().trim().min(1).optional(),
  venue: z.string().trim().min(1).optional(),
  price: z.coerce.number().nonnegative().optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
});

export const dashboardEventSchema = z.object({
  title: z.string().trim().min(3),
  city: z.string().trim().min(2),
  genre: z.string().trim().min(2),
  description: z.string().trim().min(10),
  date: z.string().datetime(),
  price: z.number().nonnegative(),
  ticketUrl: z.string().url().optional(),
  venueId: z.string().min(1),
  bandIds: z.array(z.string().min(1)).default([]),
  posterFileName: z.string().min(1).optional(),
});

export const dashboardEventUpdateSchema = dashboardEventSchema.partial();
