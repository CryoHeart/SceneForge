import { Link } from "react-router-dom";
import type { Event } from "../types";
import { formatEventDate } from "../utils/dateUtils";
import { formatILS } from "../utils/formatCurrency";
import { Badge } from "./Badge";
import { SurfaceCard } from "./SurfaceCard";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const fallbackPoster = "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1";
  const lineupText = event.bands?.length
    ? event.bands.map((band) => band.name).join(" • ")
    : "Lineup TBA";

  return (
    <SurfaceCard interactive className="flex h-full flex-col overflow-hidden">
      <Link to={`/events/${event.id}`} className="block shrink-0">
        <img
          src={event.poster?.imageUrl ?? fallbackPoster}
          alt={event.title}
          className="h-48 w-full object-cover object-top transition duration-300 hover:brightness-110"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackPoster) {
              e.currentTarget.src = fallbackPoster;
            }
          }}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white sm:text-xl">{event.title}</h3>
          <Badge>{event.genre}</Badge>
        </div>
        <p className="text-sm text-white/65">{event.venue?.name ?? "Venue TBA"} - {event.city}</p>
        <p className="line-clamp-1 text-sm text-white/65">{lineupText}</p>
        <p className="text-sm text-white/65">{formatEventDate(event.startsAt)}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-rose-300">{formatILS(event.price)}</span>
          <Link to={`/events/${event.id}`} className="text-sm text-rose-100/90 hover:text-rose-50">
            View details
          </Link>
        </div>
      </div>
    </SurfaceCard>
  );
}
