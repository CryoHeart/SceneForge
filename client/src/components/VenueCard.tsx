import { Link } from "react-router-dom";
import type { Venue } from "../types";
import { SurfaceCard } from "./SurfaceCard";

type VenueCardProps = {
  venue: Venue;
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <SurfaceCard interactive className="p-5">
      <h3 className="text-xl font-semibold text-white">{venue.name}</h3>
      <p className="mt-2 text-sm text-white/70">{venue.description}</p>
      <div className="mt-3 space-y-1 text-sm text-white/60">
        <p>{venue.city} - {venue.address}</p>
        <p>Capacity: {venue.capacity}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Link to={`/venues/${venue.id}`} className="text-sm text-rose-100/90 hover:text-rose-50">
          View venue
        </Link>
      </div>
    </SurfaceCard>
  );
}
