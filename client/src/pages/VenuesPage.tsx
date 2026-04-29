import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { VenueCard } from "../components/VenueCard";
import { getVenues } from "../services/api";
import type { Venue } from "../types";

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadVenues = () => {
    setIsLoading(true);
    setHasError(false);
    getVenues()
      .then(setVenues)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const filtered = useMemo(
    () =>
      venues.filter((venue) => {
        const queryMatch = query ? venue.name.toLowerCase().includes(query.toLowerCase()) : true;
        const cityMatch = city ? venue.city.toLowerCase().includes(city.toLowerCase()) : true;
        return queryMatch && cityMatch;
      }),
    [venues, query, city]
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Venues" subtitle="Find underground spaces by city and discover their upcoming nights." />
      <SurfaceCard className="grid gap-3 p-4 md:grid-cols-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues"
          className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Filter by city"
          className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
        />
      </SurfaceCard>

      {isLoading && <LoadingState title="Loading venues..." />}

      {hasError && (
        <ErrorState
          title="Could not load venues"
          description="Something went wrong while fetching venue data."
          actionLabel="Retry"
          onAction={loadVenues}
        />
      )}

      {!isLoading && !hasError && filtered.length === 0 && (
        <EmptyState title="No venues found" description="Try another city or search term." />
      )}

      {!isLoading && !hasError && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
