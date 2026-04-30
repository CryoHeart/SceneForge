import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppState } from "../components/AppState";
import { Badge } from "../components/Badge";
import { SectionHeader } from "../components/SectionHeader";
import { demoEvents } from "../services/demoData";
import { sceneService } from "../services/sceneService";
import type { Band } from "../types";

export function BandProfilePage() {
  const { id = "" } = useParams();
  const [band, setBand] = useState<Band | undefined>();

  useEffect(() => {
    void sceneService.getBandById(id).then(setBand);
  }, [id]);

  const upcoming = useMemo(() => demoEvents.filter((event) => event.bandIds.includes(id)), [id]);

  if (!band) {
    return <AppState title="Band not found" message="This artist profile is unavailable right now." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Artist Profile" title={band.name} subtitle="Bio, genres, links, and upcoming appearances." />
      <p className="text-zinc-300">{band.bio}</p>
      <div className="flex flex-wrap gap-2">
        {band.genres.map((genre) => (
          <Badge key={genre}>{genre}</Badge>
        ))}
      </div>
      <section className="rounded-2xl border border-zinc-800 bg-panel p-5">
        <h2 className="text-xl font-bold">Social / Music Links</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          {Object.entries(band.socialLinks).map(([name, url]) => (
            <li key={name}>
              <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:text-red-300">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-panel p-5">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <ul className="mt-3 space-y-2 text-zinc-300">
          {upcoming.map((event) => (
            <li key={event.id}>{event.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
