import { useEffect, useMemo, useState } from "react";
import { AppState, LoadingGrid } from "../components/AppState";
import { EventCard } from "../components/EventCard";
import { type EventFilters, FilterBar } from "../components/FilterBar";
import { SectionHeader } from "../components/SectionHeader";
import { sceneService } from "../services/sceneService";
import type { Event } from "../types";

const initialFilters: EventFilters = { city: "", genre: "", date: "", venue: "", price: "" };

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await sceneService.getEvents();
        setEvents(next);
      } catch {
        setError("Could not load events right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const cityOk = !filters.city || event.city.toLowerCase().includes(filters.city.toLowerCase());
      const genreOk = !filters.genre || event.genre.toLowerCase().includes(filters.genre.toLowerCase());
      const dateOk = !filters.date || event.date.startsWith(filters.date);
      const venueOk = !filters.venue || event.venueId.toLowerCase().includes(filters.venue.toLowerCase());
      const priceOk = !filters.price || event.price <= Number(filters.price);
      return cityOk && genreOk && dateOk && venueOk && priceOk;
    });
  }, [events, filters]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Discover"
        title="Events"
        subtitle="Filter underground shows by city, genre, date, venue, and ticket budget."
      />
      <FilterBar filters={filters} onChange={setFilters} />

      {error ? <AppState title="Events unavailable" message={error} tone="error" /> : null}

      {isLoading ? <LoadingGrid /> : null}

      {!isLoading && !error && filtered.length === 0 ? (
        <AppState title="No matching events" message="Try broadening your filters to discover more shows." />
      ) : null}

      {!isLoading && !error && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
