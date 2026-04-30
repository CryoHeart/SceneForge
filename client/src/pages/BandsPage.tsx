import { useEffect, useMemo, useState } from "react";
import { AppState, LoadingGrid } from "../components/AppState";
import { BandCard } from "../components/BandCard";
import { FormInput } from "../components/FormInput";
import { SectionHeader } from "../components/SectionHeader";
import { sceneService } from "../services/sceneService";
import type { Band } from "../types";

export function BandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await sceneService.getBands();
        setBands(next);
      } catch {
        setError("Could not load bands right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    return bands.filter((band) => {
      const searchOk = !search || band.name.toLowerCase().includes(search.toLowerCase());
      const genreOk = !genre || band.genres.some((item) => item.toLowerCase().includes(genre.toLowerCase()));
      return searchOk && genreOk;
    });
  }, [bands, search, genre]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Artists"
        title="Bands"
        subtitle="Search heavy acts, explore genres, and follow upcoming local favorites."
      />
      <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-panel/90 p-4 md:grid-cols-2">
        <FormInput label="Search bands" value={search} onChange={(e) => setSearch(e.target.value)} />
        <FormInput label="Filter by genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>

      {error ? <AppState title="Bands unavailable" message={error} tone="error" /> : null}
      {isLoading ? <LoadingGrid /> : null}

      {!isLoading && !error && filtered.length === 0 ? (
        <AppState title="No matching bands" message="Try a broader search or remove filters." />
      ) : null}

      {!isLoading && !error && filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
