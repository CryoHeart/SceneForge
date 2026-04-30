import type { Poster } from "../types";

export function PosterGrid({ posters }: { posters: Poster[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {posters.map((poster) => (
        <figure
          key={poster.id}
          className="group overflow-hidden rounded-2xl border border-zinc-800 bg-panelSoft transition duration-200 hover:-translate-y-1 hover:border-zinc-700"
        >
          <img
            src={poster.imageUrl}
            alt={poster.caption ?? "Poster"}
            className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          {poster.caption ? <figcaption className="px-3 py-2 text-xs text-zinc-400">{poster.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
