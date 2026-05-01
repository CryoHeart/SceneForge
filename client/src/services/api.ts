import axios from "axios";
import { demoEvents } from "./mockData";
import type { Band, Event, PaginatedResponse, Poster, User, Venue } from "../types";

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

// ─── Profile (managed bands / venues) ────────────────────────────────────────

export async function getManagedBands(token: string): Promise<Band[]> {
  const { data } = await api.get<Band[]>("/bands/managed", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateBandProfile(token: string, bandId: number, payload: Partial<Pick<Band, "name" | "bio" | "city" | "genreTags">>): Promise<Band> {
  const { data } = await api.patch<Band>(`/bands/${bandId}/profile`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getManagedVenues(token: string): Promise<Venue[]> {
  const { data } = await api.get<Venue[]>("/venues/managed", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateVenueProfile(token: string, venueId: number, payload: Partial<Pick<Venue, "name" | "description" | "address" | "city" | "capacity">>): Promise<Venue> {
  const { data } = await api.patch<Venue>(`/venues/${venueId}/profile`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthResponse = {
  token: string;
  user: User & { userTypeCode?: string | null };
};

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function registerUser(
  displayName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", { displayName, email, password });
  return data;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  role: string;
  city: string | null;
  createdAt: string;
  userTypeCode: string | null;
};

export async function adminGetUsers(token: string): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function adminUpdateUserRole(
  token: string,
  userId: number,
  role: string,
): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(
    `/admin/users/${userId}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function adminDeleteUser(token: string, userId: number): Promise<void> {
  await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { api };
