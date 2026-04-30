import { Link } from "react-router-dom";
import type { Band } from "../types";
import { Badge } from "./Badge";

export function BandCard({ band }: { band: Band }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-panel p-5 transition duration-200 hover:-translate-y-1 hover:border-zinc-700">
      <h3 className="text-lg font-bold text-zinc-100">{band.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{band.bio}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {band.genres.map((genre) => (
          <Badge key={genre}>{genre}</Badge>
        ))}
      </div>
      <Link
        to={`/bands/${band.id}`}
        className="mt-4 inline-flex items-center text-sm font-semibold text-accent transition hover:text-red-300"
      >
        Open profile
      </Link>
    </article>
  );
}
