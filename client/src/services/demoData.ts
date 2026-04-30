import type { Band, Event, Poster, Venue } from "../types";

export const demoBands: Band[] = [
  {
    id: "band-1",
    name: "Voidrite",
    bio: "Atmospheric doom with post-metal textures.",
    genres: ["doom", "post-metal"],
    city: "Seattle",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee",
    socialLinks: { instagram: "https://instagram.com", bandcamp: "https://bandcamp.com" },
  },
  {
    id: "band-2",
    name: "Steel Throne",
    bio: "Classic heavy riffs with modern groove energy.",
    genres: ["heavy metal", "groove"],
    city: "Portland",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    socialLinks: { spotify: "https://spotify.com" },
  },
  {
    id: "band-3",
    name: "Neon Ruin",
    bio: "Dark synth-rock crossing into blackened punk edges.",
    genres: ["synth-rock", "blackened punk"],
    city: "Seattle",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    socialLinks: { website: "https://example.com" },
  },
];

export const demoVenues: Venue[] = [
  {
    id: "venue-1",
    name: "Crypt Hall",
    city: "Seattle",
    address: "119 Pike St",
    capacity: 420,
    description: "Charcoal interior room with premium sound and compact pit.",
  },
  {
    id: "venue-2",
    name: "Iron Cellar",
    city: "Portland",
    address: "88 Burnside Ave",
    capacity: 280,
    description: "Basement venue known for raw underground showcases.",
  },
];

export const demoEvents: Event[] = [
  {
    id: "event-1",
    title: "Black Steel Friday",
    city: "Seattle",
    genre: "metal",
    description: "Triple-headliner featuring doom, groove, and synth-rock crossover.",
    date: "2026-06-12T20:00:00.000Z",
    price: 28,
    ticketUrl: "https://tickets.example.com/black-steel-friday",
    posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    venueId: "venue-1",
    bandIds: ["band-1", "band-2"],
  },
  {
    id: "event-2",
    title: "Ruin Circuit",
    city: "Portland",
    genre: "rock",
    description: "Late-night industrial rock and underground metal set.",
    date: "2026-06-21T21:00:00.000Z",
    price: 20,
    ticketUrl: "https://tickets.example.com/ruin-circuit",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    venueId: "venue-2",
    bandIds: ["band-3", "band-2"],
  },
];

export const demoPosters: Poster[] = demoEvents.map((event) => ({
  id: `poster-${event.id}`,
  imageUrl: event.posterUrl ?? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  caption: event.title,
  eventId: event.id,
}));
