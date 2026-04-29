import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { SurfaceCard } from "../components/SurfaceCard";
import { getEventById } from "../services/api";
import type { Event } from "../types";
import { formatEventDate } from "../utils/dateUtils";
import { formatILS } from "../utils/formatCurrency";

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadEvent = () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    getEventById(Number(id))
      .then(setEvent)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const bandsText = useMemo(() => {
    if (!event?.bands?.length) {
      return "Lineup TBA";
    }

    return event.bands.map((band) => band.name).join(" • ");
  }, [event]);
  const fallbackPoster = "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1";

  if (isLoading) {
    return <LoadingState title="Loading event details..." />;
  }

  if (hasError) {
    return (
      <ErrorState
        title="Could not load event"
        description="There was a problem loading this event profile."
        actionLabel="Retry"
        onAction={loadEvent}
      />
    );
  }

  if (!event) {
    return <EmptyState title="Event not found" description="This event may have been removed or is unavailable." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </button>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <img
          src={event.poster?.imageUrl ?? fallbackPoster}
          alt={event.title}
          className="max-h-[80vh] w-full rounded-2xl object-contain"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackPoster) {
              e.currentTarget.src = fallbackPoster;
            }
          }}
        />
      <SurfaceCard className="space-y-4 p-5 sm:p-6">
        <h1 className="font-display text-4xl text-white">{event.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge>{event.genre}</Badge>
          <Badge>{event.city}</Badge>
          <Badge>{formatILS(event.price)}</Badge>
        </div>
        <p className="text-white/70">{event.description}</p>
        <p className="text-sm text-white/70">Bands: {bandsText}</p>
        <p className="text-sm text-white/70">Venue: {event.venue?.name ?? "Venue TBA"}</p>
        <p className="text-sm text-white/70">Date: {formatEventDate(event.startsAt)}</p>
        <div className="flex flex-wrap gap-3">
          {event.ticketUrl && (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white hover:from-rose-500 hover:to-rose-400"
            >
              Get Tickets
            </a>
          )}
          <Button variant={saved ? "secondary" : "ghost"} onClick={() => setSaved((prev) => !prev)}>
            {saved ? "Saved" : "Save Event"}
          </Button>
        </div>
      </SurfaceCard>
      </div>
    </div>
  );
}
