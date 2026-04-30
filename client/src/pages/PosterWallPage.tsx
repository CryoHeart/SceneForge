import { useEffect, useState } from "react";
import { AppState, LoadingGrid } from "../components/AppState";
import { PosterGrid } from "../components/PosterGrid";
import { SectionHeader } from "../components/SectionHeader";
import { sceneService } from "../services/sceneService";
import type { Poster } from "../types";

export function PosterWallPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const next = await sceneService.getPosters();
        setPosters(next);
      } catch {
        setError("Could not load posters right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Visual Archive"
        title="Poster Wall"
        subtitle="A gallery of underground show art from across your local scene."
      />

      {error ? <AppState title="Posters unavailable" message={error} tone="error" /> : null}
      {isLoading ? <LoadingGrid count={8} /> : null}

      {!isLoading && !error && posters.length === 0 ? (
        <AppState title="No posters yet" message="Poster uploads will appear here once events publish artwork." />
      ) : null}

      {!isLoading && !error && posters.length > 0 ? <PosterGrid posters={posters} /> : null}
    </div>
  );
}
