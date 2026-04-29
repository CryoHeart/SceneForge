import { UserRole } from "@prisma/client";

export type PaginationQuery = {
  page?: string;
  limit?: string;
};

export type EventsQuery = PaginationQuery & {
  city?: string;
  genre?: string;
  date?: string;
  venueId?: string;
  maxPrice?: string;
};

export type BandsQuery = PaginationQuery & {
  q?: string;
  genre?: string;
};

export type VenuesQuery = PaginationQuery & {
  q?: string;
  city?: string;
};

export type PostersQuery = PaginationQuery;

export type RegisterInput = {
  email?: string;
  password?: string;
  displayName?: string;
  role?: UserRole;
};

export type LoginInput = {
  email?: string;
  password?: string;
};

export type CreateEventInput = {
  title?: string;
  description?: string;
  city?: string;
  genre?: string;
  startsAt?: string;
  price?: number;
  ticketUrl?: string;
  venueId?: number;
  bandIds?: number[];
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type SaveEventInput = {
  eventId?: number;
};

export type UploadPosterInput = {
  eventId?: number;
  fileName?: string;
};
