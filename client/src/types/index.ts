export type UserRole = "fan" | "band_admin" | "venue_admin" | "admin";

export type User = {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  city?: string | null;
};

export type Band = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  city?: string | null;
  genreTags: string;
  linksJson?: Record<string, string> | null;
  events?: Event[];
};

export type Venue = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
  events?: Event[];
};

export type Poster = {
  id: number;
  imageUrl: string;
  cloudinaryId?: string | null;
  eventId: number;
};

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  city: string;
  genre: string;
  startsAt: string;
  price: number | string;
  ticketUrl?: string | null;
  venueId: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  venue?: Venue;
  bands?: Band[];
  poster?: Poster | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SavedEvent = {
  id: number;
  userId: number;
  eventId: number;
  event?: Event;
};

export type DashboardStats = {
  totalEvents: number;
  upcomingEvents: number;
  savedByFans: number;
};

export type FilterState = {
  city: string;
  genre: string;
  date: string;
  venue: string;
  price: string;
};
