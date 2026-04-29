import type { Band, Event, Poster, Venue } from "../types";

export const demoBands: Band[] = [
  {
    id: 1,
    name: "Iron Veil",
    slug: "iron-veil",
    bio: "Progressive doom with razor-sharp harmonies.",
    city: "Istanbul",
    genreTags: "doom,progressive,metal",
    linksJson: {
      instagram: "https://instagram.com/ironveil",
      spotify: "https://spotify.com/ironveil",
    },
  },
  {
    id: 2,
    name: "Neon Requiem",
    slug: "neon-requiem",
    bio: "Post-metal textures and cinematic breakdowns.",
    city: "Ankara",
    genreTags: "post-metal,alternative,rock",
  },
  {
    id: 3,
    name: "Black Harbor",
    slug: "black-harbor",
    bio: "Groove-heavy modern metal from the coast.",
    city: "Izmir",
    genreTags: "groove,metalcore,metal",
  },
];

export const demoVenues: Venue[] = [
  {
    id: 1,
    name: "Forge Room",
    slug: "forge-room",
    description: "Underground basement with premium sound.",
    address: "Kadikoy District 41",
    city: "Istanbul",
    capacity: 280,
  },
  {
    id: 2,
    name: "Crimson Stage",
    slug: "crimson-stage",
    description: "Industrial warehouse venue for heavy nights.",
    address: "Cankaya District 12",
    city: "Ankara",
    capacity: 420,
  },
];

export const demoEvents: Event[] = [
  {
    id: 1,
    title: "Steel Ritual Night",
    slug: "steel-ritual-night",
    description: "Three-band showcase featuring rising local legends.",
    city: "Istanbul",
    genre: "Metal",
    startsAt: "2026-06-12T19:30:00.000Z",
    price: 18.5,
    ticketUrl: "https://tickets.sceneforge.dev/steel-ritual-night",
    venueId: 1,
    createdById: 1,
    createdAt: "2026-05-01T12:00:00.000Z",
    updatedAt: "2026-05-01T12:00:00.000Z",
    venue: demoVenues[0],
    bands: [demoBands[0], demoBands[2]],
    poster: {
      id: 1,
      eventId: 1,
      imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee",
    },
  },
  {
    id: 2,
    title: "Midnight Feedback",
    slug: "midnight-feedback",
    description: "Late-night post-metal and alt-rock fusion event.",
    city: "Ankara",
    genre: "Post-Metal",
    startsAt: "2026-06-22T20:00:00.000Z",
    price: 14,
    ticketUrl: "https://tickets.sceneforge.dev/midnight-feedback",
    venueId: 2,
    createdById: 1,
    createdAt: "2026-05-02T12:00:00.000Z",
    updatedAt: "2026-05-02T12:00:00.000Z",
    venue: demoVenues[1],
    bands: [demoBands[1]],
    poster: {
      id: 2,
      eventId: 2,
      imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491",
    },
  },
];

export const demoPosters: Poster[] = demoEvents
  .map((event) => event.poster)
  .filter((poster): poster is Poster => Boolean(poster));
