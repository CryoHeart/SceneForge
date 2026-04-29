import { useMemo } from "react";
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

    if (location.pathname.endsWith("/manage")) {
      return (
        <div className="space-y-5">
          <SectionHeader
            title="Manage Band and Venue Profiles"
            subtitle="Keep bios, links, and venue metadata aligned with your latest updates."
          />
          <p className="text-white/70">Update your bio, links, venue capacity, and profile details.</p>
          <Button variant="secondary">Open Profile Editor</Button>
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

    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Overview"
          title="Role-Based Dashboard"
          subtitle="A clean control center for events, profiles, and poster workflows."
        />
        <p className="text-white/70">
          Signed in as: <span className="text-white">{auth.user?.role ?? "fan"}</span>
        </p>

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

  return <DashboardLayout>{content}</DashboardLayout>;
}
