import { Link } from "react-router-dom";
import type { Event } from "../types";
import { formatDateTime, formatPrice } from "../utils/format";
import { Badge } from "./Badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-800 bg-panel shadow-lg transition duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-glow">
      <div className="relative">
        <img
          src={event.posterUrl ?? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"}
          alt={event.title}
          className="h-48 w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-zinc-100 transition group-hover:text-white">{event.title}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>{event.genre}</Badge>
          <Badge>{event.city}</Badge>
        </div>
        <p className="text-sm text-zinc-400">{formatDateTime(event.date)}</p>
        <p className="text-sm font-semibold text-zinc-300">{formatPrice(event.price)}</p>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center text-sm font-semibold text-accent transition hover:text-red-300"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
