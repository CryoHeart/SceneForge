import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { PosterGrid } from "../components/PosterGrid";
import { SectionHeader } from "../components/SectionHeader";
import { getPosters } from "../services/api";
import type { Poster } from "../types";

export function PosterWallPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadPosters = () => {
    setIsLoading(true);
    setHasError(false);
    getPosters()
      .then(setPosters)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPosters();
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Poster Wall"
        subtitle="A visual feed of underground nights, captured one poster at a time."
      />

      {isLoading && <LoadingState title="Loading posters..." />}

      {hasError && (
        <ErrorState
          title="Could not load posters"
          description="We could not fetch the latest poster wall right now."
          actionLabel="Retry"
          onAction={loadPosters}
        />
      )}

      {!isLoading && !hasError && posters.length === 0 && (
        <EmptyState
          title="Poster wall is empty"
          description="Once bands and venues upload posters, they will appear here."
        />
      )}

      {!isLoading && !hasError && posters.length > 0 && <PosterGrid posters={posters} />}
    </div>
  );
}
