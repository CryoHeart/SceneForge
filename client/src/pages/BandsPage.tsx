import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { BandCard } from "../components/BandCard";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { getBands } from "../services/api";
import type { Band } from "../types";

export function BandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadBands = () => {
    setIsLoading(true);
    setHasError(false);
    getBands()
      .then(setBands)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBands();
  }, []);

  const filtered = useMemo(
    () =>
      bands.filter((band) => {
        const queryMatch = query ? band.name.toLowerCase().includes(query.toLowerCase()) : true;
        const genreMatch = genre ? band.genreTags.toLowerCase().includes(genre.toLowerCase()) : true;
        return queryMatch && genreMatch;
      }),
    [bands, query, genre]
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Bands" subtitle="Search local artists and filter by genre tags." />
      <SurfaceCard className="grid gap-3 p-4 md:grid-cols-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bands"
          className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
        />
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Filter by genre"
          className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
        />
      </SurfaceCard>

      {isLoading && <LoadingState title="Loading bands..." />}

      {hasError && (
        <ErrorState
          title="Could not load bands"
          description="Something went wrong while fetching band profiles."
          actionLabel="Retry"
          onAction={loadBands}
        />
      )}

      {!isLoading && !hasError && filtered.length === 0 && (
        <EmptyState title="No bands found" description="Try another keyword or a broader genre filter." />
      )}

      {!isLoading && !hasError && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      )}
    </div>
  );
}
