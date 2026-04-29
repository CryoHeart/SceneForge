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
};

export type Venue = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
};

export type Poster = {
  id: number;
  imageUrl: string;
  cloudinaryId?: string | null;
  eventId: number;
};

export type Setlist = {
  id: number;
  eventId: number;
  bandId: number;
  songsJson: string[];
  notes?: string | null;
};

export type Event = {
  id: number;
  title: string;
  slug: string;
  description: string;
  city: string;
  genre: string;
  startsAt: string;
  price: number;
  ticketUrl?: string | null;
  venueId: number;
  venue?: Venue;
  bands?: Band[];
  poster?: Poster | null;
};

export type SavedEvent = {
  id: number;
  userId: number;
  eventId: number;
  event?: Event;
};
