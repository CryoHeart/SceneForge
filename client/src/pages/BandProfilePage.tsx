import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { Badge } from "../components/Badge";
import { EventCard } from "../components/EventCard";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { getBandById } from "../services/api";
import type { Band } from "../types";
import { splitTags } from "../utils/format";

export function BandProfilePage() {
  const { id } = useParams();
  const [band, setBand] = useState<Band | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadBand = () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    getBandById(Number(id))
      .then((bandData) => {
        setBand(bandData);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBand();
  }, [id]);

  const upcomingEvents = band?.events ?? [];

  if (isLoading) {
    return <LoadingState title="Loading band profile..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Could not load band profile"
        description="There was a problem loading this band's details."
        actionLabel="Retry"
        onAction={loadBand}
      />
    );
  }

  if (!band) {
    return <EmptyState title="Band not found" description="This band profile is unavailable right now." />;
  }

  return (
    <div className="space-y-6">
      <SurfaceCard className="p-6">
        <h1 className="font-display text-5xl text-white">{band.name}</h1>
        <p className="mt-4 max-w-3xl text-white/70">{band.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {splitTags(band.genreTags).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 text-sm text-white/70">
          {Object.entries(band.linksJson ?? {}).map(([key, value]) => (
            <a key={key} href={value} target="_blank" rel="noreferrer" className="mr-4 capitalize text-rose-100/90 hover:text-rose-50">
              {key}
            </a>
          ))}
        </div>
      </SurfaceCard>

      <section className="space-y-4">
        <SectionHeader title="Upcoming Events" />
        {upcomingEvents.length === 0 ? (
          <EmptyState title="No upcoming events" description="This band has no published events yet." />
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
