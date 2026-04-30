import { Link } from "react-router-dom";
import type { Venue } from "../types";

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-panel p-5 transition duration-200 hover:-translate-y-1 hover:border-zinc-700">
      <h3 className="text-lg font-bold text-zinc-100">{venue.name}</h3>
      <p className="mt-2 text-sm text-zinc-400">{venue.city}</p>
      <p className="text-sm text-zinc-400">Capacity: {venue.capacity}</p>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">{venue.description}</p>
      <Link
        to={`/venues/${venue.id}`}
        className="mt-4 inline-flex items-center text-sm font-semibold text-accent transition hover:text-red-300"
      >
        Open venue
      </Link>
    </article>
  );
}
