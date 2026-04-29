import type { ChangeEvent } from "react";
import type { FilterState } from "../types";

type FilterBarProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
};

export function FilterBar({ value, onChange }: FilterBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-scene-800/85 p-4 shadow-panel md:grid-cols-5">
      <input
        name="city"
        value={value.city}
        onChange={handleChange}
        placeholder="City"
        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
      />
      <input
        name="genre"
        value={value.genre}
        onChange={handleChange}
        placeholder="Genre"
        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
      />
      <input
        name="date"
        type="date"
        value={value.date}
        onChange={handleChange}
        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition focus:border-rose-300/55"
      />
      <input
        name="venue"
        value={value.venue}
        onChange={handleChange}
        placeholder="Venue"
        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55"
      />
      <select
        name="price"
        value={value.price}
        onChange={handleChange}
        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition focus:border-rose-300/55"
      >
        <option value="">Any price</option>
        <option value="10">Under ₪10</option>
        <option value="20">Under ₪20</option>
        <option value="40">Under ₪40</option>
      </select>
    </div>
  );
}
