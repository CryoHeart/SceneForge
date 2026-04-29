import { useState } from "react";
import type { Poster } from "../types";

type PosterGridProps = {
  posters: Poster[];
};

export function PosterGrid({ posters }: PosterGridProps) {
  const fallbackPoster = "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1";
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {posters.map((poster) => (
          <button
            key={poster.id}
            type="button"
            onClick={() => setLightbox(poster.imageUrl || fallbackPoster)}
            className="group overflow-hidden rounded-xl border border-white/10 bg-scene-800/80 shadow-panel transition hover:border-rose-200/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <img
              src={poster.imageUrl || fallbackPoster}
              alt={`Poster ${poster.id}`}
              className="h-52 w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                if (e.currentTarget.src !== fallbackPoster) {
                  e.currentTarget.src = fallbackPoster;
                }
              }}
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={lightbox}
            alt="Poster full view"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
