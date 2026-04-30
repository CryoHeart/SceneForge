import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppState } from "../components/AppState";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { SectionHeader } from "../components/SectionHeader";
import { demoBands, demoVenues } from "../services/demoData";
import { sceneService } from "../services/sceneService";
import type { Event } from "../types";
import { formatDateTime, formatPrice } from "../utils/format";

export function EventDetailsPage() {
  const { id = "" } = useParams();
  const [event, setEvent] = useState<Event | undefined>();
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await sceneService.getEventById(id);
        setEvent(next);
      } catch {
        setError("Could not load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  const bands = useMemo(() => demoBands.filter((band) => event?.bandIds.includes(band.id)), [event]);
  const venue = useMemo(() => demoVenues.find((item) => item.id === event?.venueId), [event]);

  if (isLoading) {
    return <AppState title="Loading event" message="Pulling show details from the scene feed..." />;
  }

  if (error) {
    return <AppState title="Event unavailable" message={error} tone="error" />;
  }

  if (!event) {
    return <AppState title="Event not found" message="This event may have been removed or has not been published yet." />;
  }

  const handleSave = async () => {
    const token = localStorage.getItem("sceneforge_token") ?? undefined;
    const saved = await sceneService.saveEvent(event.id, token);
    setStatus(saved ? "Saved to your account." : "Login required to save events.");
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Show Details" title={event.title} subtitle="Full lineup, venue context, and ticket access." />
      <img
        src={event.posterUrl ?? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"}
        alt={event.title}
        className="h-72 w-full rounded-2xl border border-zinc-800 object-cover"
      />
      <div className="rounded-2xl border border-zinc-800 bg-panel p-6">
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{event.genre}</Badge>
          <Badge>{event.city}</Badge>
        </div>
        <p className="mt-4 text-zinc-300">{event.description}</p>
        <p className="mt-3 text-zinc-400">{formatDateTime(event.date)}</p>
        <p className="text-zinc-400">{formatPrice(event.price)}</p>
        {event.ticketUrl ? (
          <a href={event.ticketUrl} className="mt-4 inline-block text-sm font-semibold text-accent hover:text-red-300" target="_blank" rel="noreferrer">
            Ticket link
          </a>
        ) : null}
        <div className="mt-4">
          <Button onClick={handleSave}>Save event</Button>
          {status ? <p className="mt-2 text-sm text-zinc-400">{status}</p> : null}
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-panel p-6">
        <h2 className="text-xl font-bold">Bands Playing</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          {bands.map((band) => (
            <li key={band.id}>{band.name}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-panel p-6">
        <h2 className="text-xl font-bold">Venue Info</h2>
        <p className="mt-2 text-zinc-300">{venue?.name ?? "Unknown venue"}</p>
        <p className="text-zinc-400">{venue?.address}</p>
      </section>
    </div>
  );
}
