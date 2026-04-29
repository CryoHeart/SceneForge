import axios from "axios";
import { demoEvents } from "./mockData";
import type { Band, Event, PaginatedResponse, Poster, Venue } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

function logApiError(endpoint: string, error: unknown): void {
  console.error(`[SceneForge API] Request failed: ${endpoint}`, error);
}

export async function getEvents(): Promise<Event[]> {
  try {
    const pageSize = 100;
    const firstResponse = await api.get<PaginatedResponse<Event> | Event[]>("/events", {
      params: { page: 1, limit: pageSize },
    });

    if (Array.isArray(firstResponse.data)) {
      return firstResponse.data;
    }

    if (firstResponse.data.pagination.totalPages <= 1) {
      return firstResponse.data.data;
    }

    const remainingRequests: Array<Promise<{ data: PaginatedResponse<Event> }>> = [];
    for (let page = 2; page <= firstResponse.data.pagination.totalPages; page += 1) {
      remainingRequests.push(
        api.get<PaginatedResponse<Event>>("/events", {
          params: { page, limit: pageSize },
        })
      );
    }

    const remainingPages = await Promise.all(remainingRequests);
    return [firstResponse.data, ...remainingPages.map((response) => response.data)]
      .flatMap((pageData) => pageData.data);
  } catch (error) {
    logApiError("GET /events", error);
    console.error("[SceneForge API] Falling back to local demo events after GET /events failure.");
    return demoEvents;
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  try {
    const result = await api.get<{ data: Event } | Event>(`/events/${id}`);
    return "data" in result.data ? result.data.data : result.data;
  } catch (error) {
    logApiError(`GET /events/${id}`, error);
    const fallbackEvent = demoEvents.find((event) => event.id === id) ?? null;
    if (fallbackEvent) {
      console.error(`[SceneForge API] Falling back to local demo event for id=${id}.`);
      return fallbackEvent;
    }

    throw error;
  }
}

export async function getBands(): Promise<Band[]> {
  try {
    const pageSize = 100;
    const { data: firstPage } = await api.get<PaginatedResponse<Band>>("/bands", {
      params: { page: 1, limit: pageSize },
    });

    if (firstPage.pagination.totalPages <= 1) {
      return firstPage.data;
    }

    const remainingRequests: Array<Promise<{ data: PaginatedResponse<Band> }>> = [];
    for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
      remainingRequests.push(
        api.get<PaginatedResponse<Band>>("/bands", {
          params: { page, limit: pageSize },
        })
      );
    }

    const remainingPages = await Promise.all(remainingRequests);
    return [firstPage, ...remainingPages.map((response) => response.data)]
      .flatMap((pageData) => pageData.data);
  } catch (error) {
    logApiError("GET /bands", error);
    throw error;
  }
}

export async function getBandById(id: number): Promise<Band | null> {
  try {
    const { data } = await api.get<Band>(`/bands/${id}`);
    return data;
  } catch (error) {
    logApiError(`GET /bands/${id}`, error);
    throw error;
  }
}

export async function getVenues(): Promise<Venue[]> {
  try {
    const { data } = await api.get<PaginatedResponse<Venue>>("/venues");
    return data.data;
  } catch (error) {
    logApiError("GET /venues", error);
    throw error;
  }
}

export async function getVenueById(id: number): Promise<Venue | null> {
  try {
    const { data } = await api.get<Venue>(`/venues/${id}`);
    return data;
  } catch (error) {
    logApiError(`GET /venues/${id}`, error);
    throw error;
  }
}

export async function getPosters(): Promise<Poster[]> {
  try {
    const { data } = await api.get<PaginatedResponse<Poster>>("/posters");
    return data.data;
  } catch (error) {
    logApiError("GET /posters", error);
    throw error;
  }
}

export { api };
