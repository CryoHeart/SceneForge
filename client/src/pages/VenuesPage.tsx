import { useEffect, useMemo, useState } from "react";
import { AppState, LoadingGrid } from "../components/AppState";
import { FormInput } from "../components/FormInput";
import { SectionHeader } from "../components/SectionHeader";
import { VenueCard } from "../components/VenueCard";
import { sceneService } from "../services/sceneService";
import type { Venue } from "../types";

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await sceneService.getVenues();
        setVenues(next);
      } catch {
        setError("Could not load venues right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    return venues.filter((venue) => {
      const searchOk = !search || venue.name.toLowerCase().includes(search.toLowerCase());
      const cityOk = !city || venue.city.toLowerCase().includes(city.toLowerCase());
      return searchOk && cityOk;
    });
  }, [venues, search, city]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Spaces"
        title="Venues"
        subtitle="Find underground rooms by city, capacity, and scene fit."
      />
      <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-panel/90 p-4 md:grid-cols-2">
        <FormInput label="Search venue" value={search} onChange={(e) => setSearch(e.target.value)} />
        <FormInput label="Filter by city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>

      {error ? <AppState title="Venues unavailable" message={error} tone="error" /> : null}
      {isLoading ? <LoadingGrid /> : null}

      {!isLoading && !error && filtered.length === 0 ? (
        <AppState title="No matching venues" message="Adjust your city or search term to broaden results." />
      ) : null}

      {!isLoading && !error && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
