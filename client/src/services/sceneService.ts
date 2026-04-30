import type { Band, Event, Poster, SavedEvent, Venue } from "../types";
import { apiGet, apiPost } from "./api";
import { demoBands, demoEvents, demoPosters, demoVenues } from "./demoData";

export const sceneService = {
  async getEvents(): Promise<Event[]> {
    try {
      return await apiGet<Event[]>("/api/events");
    } catch {
      return demoEvents;
    }
  },

  async getEventById(id: string): Promise<Event | undefined> {
    try {
      return await apiGet<Event>(`/api/events/${id}`);
    } catch {
      return demoEvents.find((event) => event.id === id);
    }
  },

  async getBands(): Promise<Band[]> {
    try {
      return await apiGet<Band[]>("/api/bands");
    } catch {
      return demoBands;
    }
  },

  async getBandById(id: string): Promise<Band | undefined> {
    try {
      return await apiGet<Band>(`/api/bands/${id}`);
    } catch {
      return demoBands.find((band) => band.id === id);
    }
  },

  async getVenues(): Promise<Venue[]> {
    try {
      return await apiGet<Venue[]>("/api/venues");
    } catch {
      return demoVenues;
    }
  },

  async getVenueById(id: string): Promise<Venue | undefined> {
    try {
      return await apiGet<Venue>(`/api/venues/${id}`);
    } catch {
      return demoVenues.find((venue) => venue.id === id);
    }
  },

  async getPosters(): Promise<Poster[]> {
    try {
      return await apiGet<Poster[]>("/api/posters");
    } catch {
      return demoPosters;
    }
  },

  async saveEvent(eventId: string, token?: string): Promise<SavedEvent | undefined> {
    if (!token) {
      return undefined;
    }

    try {
      return await apiPost<SavedEvent>("/api/saved-events", { eventId }, token);
    } catch {
      return undefined;
    }
  },
};
