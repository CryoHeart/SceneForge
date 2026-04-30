import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppState, LoadingGrid } from "../components/AppState";
import { BandCard } from "../components/BandCard";
import { Button } from "../components/Button";
import { EventCard } from "../components/EventCard";
import { PosterGrid } from "../components/PosterGrid";
import { SectionHeader } from "../components/SectionHeader";
import { sceneService } from "../services/sceneService";
import type { Band, Event, Poster } from "../types";

export function LandingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [bands, setBands] = useState<Band[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [nextEvents, nextBands, nextPosters] = await Promise.all([
          sceneService.getEvents(),
          sceneService.getBands(),
          sceneService.getPosters(),
        ]);
        setEvents(nextEvents.slice(0, 3));
        setBands(nextBands.slice(0, 3));
        setPosters(nextPosters.slice(0, 4));
      } catch {
        setError("Could not load scene highlights right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-glow md:p-10">
        <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-accentAlt/20 blur-3xl" />

        <p className="text-xs uppercase tracking-[0.24em] text-accent/90">Underground Scene Discovery</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          Discover the loudest local nights with premium scene intelligence.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-400 md:text-lg">
          SceneForge maps underground events, bands, venues, and posters in one dark, modern experience built for heavy music communities.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/events">
            <Button>Explore Events</Button>
          </Link>
          <Link to="/posters">
            <Button variant="ghost">Browse Poster Wall</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Upcoming Shows</p>
            <p className="mt-2 text-2xl font-black text-zinc-100">{events.length || "--"}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Active Bands</p>
            <p className="mt-2 text-2xl font-black text-zinc-100">{bands.length || "--"}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Fresh Posters</p>
            <p className="mt-2 text-2xl font-black text-zinc-100">{posters.length || "--"}</p>
          </div>
        </div>
      </section>

      {error ? <AppState title="Scene feed unavailable" message={error} tone="error" /> : null}

      <section>
        <SectionHeader title="Featured Upcoming Shows" subtitle="Curated local picks worth planning your week around." />
        <div className="mt-5">
          {isLoading ? (
            <LoadingGrid count={3} />
          ) : events.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <AppState title="No featured events" message="Check back soon for newly announced nights." />
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Popular Bands" subtitle="Artists currently moving the local heavy scene forward." />
        <div className="mt-5">
          {isLoading ? (
            <LoadingGrid count={3} />
          ) : bands.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {bands.map((band) => (
                <BandCard key={band.id} band={band} />
              ))}
            </div>
          ) : (
            <AppState title="No bands to show" message="Band profiles will appear here as the scene grows." />
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Poster Wall Preview" subtitle="Fresh visual drops from upcoming nights and underground collectives." />
        <div className="mt-5">
          {isLoading ? (
            <LoadingGrid count={4} />
          ) : posters.length ? (
            <PosterGrid posters={posters} />
          ) : (
            <AppState title="No posters yet" message="Posters will appear once events start publishing artwork." />
          )}
        </div>
      </section>
    </div>
  );
}
