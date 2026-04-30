import { FormInput } from "./FormInput";

export interface EventFilters {
  city: string;
  genre: string;
  date: string;
  venue: string;
  price: string;
}

interface FilterBarProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section className="grid gap-3 rounded-2xl border border-zinc-800 bg-panel/90 p-4 md:grid-cols-2 lg:grid-cols-5">
      <FormInput label="City" value={filters.city} onChange={(e) => onChange({ ...filters, city: e.target.value })} />
      <FormInput label="Genre" value={filters.genre} onChange={(e) => onChange({ ...filters, genre: e.target.value })} />
      <FormInput
        label="Date"
        type="date"
        value={filters.date}
        onChange={(e) => onChange({ ...filters, date: e.target.value })}
      />
      <FormInput label="Venue" value={filters.venue} onChange={(e) => onChange({ ...filters, venue: e.target.value })} />
      <FormInput
        label="Max Price"
        type="number"
        min={0}
        value={filters.price}
        onChange={(e) => onChange({ ...filters, price: e.target.value })}
      />
    </section>
  );
}
