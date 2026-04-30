export type UserRole = "fan" | "band_admin" | "venue_admin" | "admin";

export interface Band {
  id: string;
  name: string;
  bio: string;
  genres: string[];
  city: string;
  imageUrl?: string;
  socialLinks: Record<string, string>;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  city: string;
  genre: string;
  description: string;
  date: string;
  price: number;
  ticketUrl?: string;
  posterUrl?: string;
  venueId: string;
  bandIds: string[];
}

export interface Poster {
  id: string;
  imageUrl: string;
  caption?: string;
  eventId?: string;
}

export interface SavedEvent {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
