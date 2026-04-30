import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppState } from "../components/AppState";
import { SectionHeader } from "../components/SectionHeader";
import { demoEvents } from "../services/demoData";
import { sceneService } from "../services/sceneService";
import type { Venue } from "../types";

export function VenueProfilePage() {
  const { id = "" } = useParams();
  const [venue, setVenue] = useState<Venue | undefined>();

  useEffect(() => {
    void sceneService.getVenueById(id).then(setVenue);
  }, [id]);

  const upcoming = useMemo(() => demoEvents.filter((event) => event.venueId === id), [id]);

  if (!venue) {
    return <AppState title="Venue not found" message="This venue profile is unavailable right now." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Venue Profile" title={venue.name} subtitle="Location details, capacity, and upcoming nights." />
      <p className="text-zinc-300">{venue.description}</p>
      <section className="rounded-2xl border border-zinc-800 bg-panel p-5">
        <h2 className="text-xl font-bold">Venue Details</h2>
        <p className="mt-2 text-zinc-300">{venue.city}</p>
        <p className="text-zinc-400">{venue.address}</p>
        <p className="text-zinc-400">Capacity: {venue.capacity}</p>
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-panel p-5">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          {upcoming.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
