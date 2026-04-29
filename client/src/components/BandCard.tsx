import { Link } from "react-router-dom";
import type { Band } from "../types";
import { splitTags } from "../utils/format";
import { Badge } from "./Badge";
import { SurfaceCard } from "./SurfaceCard";

type BandCardProps = {
  band: Band;
};

export function BandCard({ band }: BandCardProps) {
  return (
    <SurfaceCard interactive className="flex h-full flex-col p-5">
      <h3 className="text-xl font-semibold text-white">{band.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-white/65">{band.bio}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {splitTags(band.genreTags).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-auto flex justify-end pt-4">
        <Link to={`/bands/${band.id}`} className="text-sm text-rose-100/90 hover:text-rose-50">
          Open profile
        </Link>
      </div>
    </SurfaceCard>
  );
}
