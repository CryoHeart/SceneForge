import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { EventCard } from "../components/EventCard";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { getVenueById } from "../services/api";
import type { Venue } from "../types";

export function VenueProfilePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadVenue = () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    getVenueById(Number(id))
      .then((venueData) => {
        setVenue(venueData);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  const upcomingEvents = venue?.events ?? [];

  if (isLoading) {
    return <LoadingState title="Loading venue profile..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Could not load venue profile"
        description="There was a problem loading this venue's details."
        actionLabel="Retry"
        onAction={loadVenue}
      />
    );
  }

  if (!venue) {
    return <EmptyState title="Venue not found" description="This venue profile is unavailable right now." />;
  }

  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6">
        <h1 className="font-display text-5xl text-white">{venue.name}</h1>
        <p className="mt-4 text-white/70">{venue.description}</p>
        <div className="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-3">
          <p>City: {venue.city}</p>
          <p>Address: {venue.address}</p>
          <p>Capacity: {venue.capacity}</p>
        </div>
      </SurfaceCard>

      <section className="space-y-4">
        <SectionHeader title="Upcoming Events" />
        {upcomingEvents.length === 0 ? (
          <EmptyState title="No upcoming events" description="This venue currently has no scheduled events." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
