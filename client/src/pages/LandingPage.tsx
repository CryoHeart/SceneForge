import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { BandCard } from "../components/BandCard";
import { EventCard } from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { PosterGrid } from "../components/PosterGrid";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { getBands, getPosters } from "../services/api";
import type { Band, Event, Poster } from "../types";
import { Link } from "react-router-dom";

export function LandingPage() {
  const { events, isLoading: isEventsLoading, hasError: eventsError, refetchEvents } = useEvents();
  const [bands, setBands] = useState<Band[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isSupportingDataLoading, setIsSupportingDataLoading] = useState(true);
  const [hasSupportingDataError, setHasSupportingDataError] = useState(false);

  const featuredEvents = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((event) => new Date(event.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 4);
  }, [events]);

  const loadLandingData = () => {
    setIsSupportingDataLoading(true);
    setHasSupportingDataError(false);

    Promise.all([getBands(), getPosters()])
      .then(([bandData, posterData]) => {
        setBands(bandData.slice(0, 3));
        setPosters(posterData.slice(0, 4));
      })
      .catch(() => {
        setHasSupportingDataError(true);
      })
      .finally(() => {
        setIsSupportingDataLoading(false);
      });
  };

  useEffect(() => {
    loadLandingData();
  }, []);

  const isLoading = isEventsLoading || isSupportingDataLoading;
  const hasError = eventsError || hasSupportingDataError;

  const handleRetry = () => {
    refetchEvents();
    loadLandingData();
  };

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 px-6 py-8 shadow-panel sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,0.18),transparent_38%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-200/80">Local Underground Discovery</p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Forge Your Next Night in the Scene
            </h1>
            <p className="mt-4 max-w-2xl text-white/70 sm:text-lg">
              SceneForge helps fans discover local metal and rock shows, follow bands, scout venues, and keep a pulse on the underground.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/events"
                className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-rose-500 hover:to-rose-400"
              >
                Explore Shows
              </Link>
              <Link
                to="/posters"
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5"
              >
                View Poster Wall
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Upcoming", value: events.length },
              { label: "Bands", value: bands.length },
              { label: "Venues", value: new Set(featuredEvents.map((event) => event.venueId)).size },
            ].map((item) => (
              <SurfaceCard key={item.label} className="p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-white/55">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {isLoading && <LoadingState title="Loading featured scene activity..." />}

      {hasError && (
        <ErrorState
          title="Unable to load featured content"
          description="We hit a network problem while loading the landing data."
          actionLabel="Try Again"
          onAction={handleRetry}
        />
      )}

      {!isLoading && !hasError && (
        <>
          <section className="space-y-4">
            <SectionHeader title="Featured Upcoming Shows" subtitle="Curated heavy nights across your local scene." />
            {featuredEvents.length === 0 ? (
              <EmptyState
                title="No featured events yet"
                description="New events will appear here once promoters publish upcoming shows."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeader title="Popular Bands" subtitle="Discover rising acts and scene staples in one place." />
            {bands.length === 0 ? (
              <EmptyState
                title="No bands available"
                description="Band profiles will show here after artists join the platform."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bands.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionHeader title="Poster Wall Preview" subtitle="A visual archive of upcoming nights and scene culture." />
            {posters.length === 0 ? (
              <EmptyState
                title="No posters yet"
                description="Posters uploaded by bands and venues will appear here."
              />
            ) : (
              <PosterGrid posters={posters} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
