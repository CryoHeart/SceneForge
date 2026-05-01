import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { EmptyState } from "../components/AppStates";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { useEvents } from "../hooks/useEvents";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { formatEventDate } from "../utils/dateUtils";
import { getManagedBands, getManagedVenues, updateBandProfile, updateVenueProfile } from "../services/api";
import type { Band, Venue } from "../types";

// ─── Manage Profile Section ──────────────────────────────────────────────────

function BandProfileEditor({ token, band, onSaved }: { token: string; band: Band; onSaved: (b: Band) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement).value.trim();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateBandProfile(token, band.id, {
        name: get("band-name"),
        bio: get("band-bio"),
        city: get("band-city"),
        genreTags: get("band-genres"),
      });
      onSaved(updated);
      setSuccess(true);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form key={band.id} onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput id="band-name" label="Band Name" defaultValue={band.name} required />
        <FormInput id="band-city" label="City" defaultValue={band.city ?? ""} placeholder="Istanbul" />
        <FormInput id="band-genres" label="Genre Tags" defaultValue={band.genreTags} placeholder="metal,doom,progressive" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="band-bio" className="text-sm font-medium text-white/75">Bio</label>
        <textarea id="band-bio" name="band-bio" rows={4} defaultValue={band.bio}
          className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-rose-300/55 focus:bg-black/35" />
      </div>
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      {success && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Changes saved successfully.</p>}
      <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
    </form>
  );
}

function VenueProfileEditor({ token, venue, onSaved }: { token: string; venue: Venue; onSaved: (v: Venue) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement).value.trim();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateVenueProfile(token, venue.id, {
        name: get("venue-name"),
        description: get("venue-description"),
        address: get("venue-address"),
        city: get("venue-city"),
        capacity: Number(get("venue-capacity")),
      });
      onSaved(updated);
      setSuccess(true);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form key={venue.id} onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormInput id="venue-name" label="Venue Name" defaultValue={venue.name} required />
        <FormInput id="venue-city" label="City" defaultValue={venue.city} required />
        <FormInput id="venue-address" label="Address" defaultValue={venue.address} />
        <FormInput id="venue-capacity" label="Capacity" type="number" defaultValue={String(venue.capacity)} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="venue-description" className="text-sm font-medium text-white/75">Description</label>
        <textarea id="venue-description" name="venue-description" rows={4} defaultValue={venue.description}
          className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-rose-300/55 focus:bg-black/35" />
      </div>
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      {success && <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Changes saved successfully.</p>}
      <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
    </form>
  );
}

function ManagedListEditor<T extends { id: number; name: string }>({
  label,
  items,
  renderEditor,
}: {
  label: string;
  items: T[];
  renderEditor: (item: T, onSaved: (updated: T) => void) => React.ReactNode;
}) {
  const [list, setList] = useState<T[]>(items);
  const [selectedId, setSelectedId] = useState<number>(items[0]?.id ?? 0);
  const selected = list.find((i) => i.id === selectedId) ?? list[0];

  function handleSaved(updated: T) {
    setList((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  if (!selected) return null;

  return (
    <SurfaceCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        {list.length > 1 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="rounded-md border border-white/15 bg-scene-800 px-2 py-1 text-sm text-white focus:border-rose-400 focus:outline-none"
          >
            {list.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        )}
      </div>
      {renderEditor(selected, handleSaved as (updated: T) => void)}
    </SurfaceCard>
  );
}

function ManageProfileSection() {
  const auth = useAuth();
  const role = auth.user?.role;
  const token = auth.token;

  const [bands, setBands] = useState<Band[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showBands = role === "band_admin" || role === "admin";
  const showVenues = role === "venue_admin" || role === "admin";

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [b, v] = await Promise.all([
        showBands ? getManagedBands(token) : Promise.resolve([]),
        showVenues ? getManagedVenues(token) : Promise.resolve([]),
      ]);
      setBands(b);
      setVenues(v);
    } catch {
      setError("Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  }, [token, showBands, showVenues]);

  useEffect(() => { void load(); }, [load]);

  if (!token || role === "fan") {
    return (
      <div className="space-y-4">
        <SectionHeader title="Manage Profiles" subtitle="Your fan account doesn't have an associated band or venue." />
        <p className="text-sm text-white/55">Only band admins and venue admins can edit profiles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Manage Profiles" title="Edit Your Profile"
        subtitle="Keep your bio, links, and venue metadata up to date." />
      {loading && <p className="text-sm text-white/55">Loading profiles…</p>}
      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      {!loading && showBands && (
        bands.length === 0
          ? <SurfaceCard className="p-5"><p className="text-sm text-white/55">No bands found in the system.</p></SurfaceCard>
          : <ManagedListEditor label="Band Profile" items={bands}
              renderEditor={(band, onSaved) => (
                <BandProfileEditor token={token} band={band} onSaved={onSaved} />
              )} />
      )}
      {!loading && showVenues && (
        venues.length === 0
          ? <SurfaceCard className="p-5"><p className="text-sm text-white/55">No venues found in the system.</p></SurfaceCard>
          : <ManagedListEditor label="Venue Profile" items={venues}
              renderEditor={(venue, onSaved) => (
                <VenueProfileEditor token={token} venue={venue} onSaved={onSaved} />
              )} />
      )}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const location = useLocation();
  const auth = useAuth();
  const { events, isLoading, hasError, refetchEvents } = useEvents();

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => new Date(event.startsAt).getTime() >= Date.now())
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    [events],
  );

  const recentDashboardEvents = upcomingEvents.slice(0, 3);

  const isManage = location.pathname.endsWith("/manage");

  const content = useMemo(() => {
    if (location.pathname.endsWith("/events")) {
      return (
        <div className="space-y-5">
          <SectionHeader
            title="Create or Edit Events"
            subtitle="Publish upcoming shows quickly with essential details for fans."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Event Title" id="event-title" placeholder="Steel Ritual Night" />
            <FormInput label="City" id="event-city" placeholder="Istanbul" />
            <FormInput label="Date" id="event-date" type="date" />
            <FormInput label="Price (ILS)" id="event-price" placeholder="80" />
          </div>
          <div className="flex gap-3">
            <Button>Create Event</Button>
            <Button variant="ghost">Save Draft</Button>
            <Button variant="secondary" onClick={refetchEvents}>Refresh Events</Button>
          </div>
          <SurfaceCard className="p-5">
            <h3 className="text-base font-semibold text-white">Upcoming Events</h3>
            {isLoading ? (
              <p className="mt-3 text-sm text-white/65">Refreshing events from backend...</p>
            ) : hasError ? (
              <p className="mt-3 text-sm text-rose-200">Could not load events from backend.</p>
            ) : recentDashboardEvents.length === 0 ? (
              <p className="mt-3 text-sm text-white/65">No upcoming events found.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {recentDashboardEvents.map((event) => (
                  <li key={event.id}>{event.title} • {event.venue?.name ?? "Venue TBA"} • {formatEventDate(event.startsAt)}</li>
                ))}
              </ul>
            )}
          </SurfaceCard>
        </div>
      );
    }

    if (location.pathname.endsWith("/upload")) {
      return (
        <div className="space-y-5">
          <SectionHeader
            title="Upload Poster"
            subtitle="Cloudinary integration is mocked in this MVP and ready to be swapped with real upload logic."
          />
          <p className="text-white/70">Cloudinary integration is prepared server-side and mocked for MVP.</p>
          <FormInput label="Poster File Name" id="poster-file" placeholder="steel-ritual.jpg" />
          <Button>Upload Placeholder</Button>
        </div>
      );
    }

    const roleLabel: Record<string, string> = {
      fan: "Fan",
      band_admin: "Band Admin",
      venue_admin: "Venue Admin",
      admin: "Admin",
    };

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-white/45">Signed in as</p>
          <p className="mt-1 text-xl font-semibold text-white">
            Welcome, {auth.user?.displayName ?? "User"} 👋
          </p>
          <p className="mt-0.5 text-sm text-white/55">
            {roleLabel[auth.user?.role ?? "fan"] ?? auth.user?.role}
          </p>
        </div>
        <SectionHeader
          eyebrow="Overview"
          title="Role-Based Dashboard"
          subtitle="A clean control center for events, profiles, and poster workflows."
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <SurfaceCard className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/55">Upcoming Events</p>
            <p className="mt-2 text-2xl font-semibold text-white">{upcomingEvents.length}</p>
          </SurfaceCard>
          <SurfaceCard className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/55">Saved by Fans</p>
            <p className="mt-2 text-2xl font-semibold text-white">89</p>
          </SurfaceCard>
          <SurfaceCard className="p-4">
            <p className="text-xs uppercase tracking-wide text-white/55">Draft Posters</p>
            <p className="mt-2 text-2xl font-semibold text-white">4</p>
          </SurfaceCard>
        </div>

        <SurfaceCard className="p-5">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="mt-1 text-sm text-white/65">Start a task fast from your dashboard workflow.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Create Event</Button>
            <Button variant="secondary">Manage Profile</Button>
            <Button variant="ghost">Upload Poster</Button>
          </div>
        </SurfaceCard>

        <div className="grid gap-3 md:grid-cols-2">
          <SurfaceCard className="p-5">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            {recentDashboardEvents.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  title="No upcoming events"
                  description="Publish an event to start seeing your live schedule here."
                />
              </div>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {recentDashboardEvents.map((event) => (
                  <li key={event.id}>{event.title} • {event.venue?.name ?? "Venue TBA"} • {formatEventDate(event.startsAt)}</li>
                ))}
              </ul>
            )}
          </SurfaceCard>
          <SurfaceCard className="p-5">
            <h3 className="text-base font-semibold text-white">Publishing Health</h3>
            <p className="mt-3 text-sm text-white/65">
              You have 3 draft updates pending. Publish to increase reach before the weekend cycle.
            </p>
          </SurfaceCard>
        </div>
      </div>
    );
  }, [
    auth.user?.role,
    hasError,
    isLoading,
    location.pathname,
    recentDashboardEvents,
    refetchEvents,
    upcomingEvents.length,
  ]);

  if (isManage) {
    return (
      <DashboardLayout>
        <ManageProfileSection />
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}
