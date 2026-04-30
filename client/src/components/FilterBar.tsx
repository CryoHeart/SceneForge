import type { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { FilterState } from "../types";

type FilterBarProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
};

const inputClass =
  "rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition placeholder:text-white/40 focus:border-rose-300/55";

export function FilterBar({ value, onChange }: FilterBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateRangeChange = ([start, end]: [Date | null, Date | null]) => {
    onChange({
      ...value,
      dateFrom: start ? start.toISOString().split("T")[0] : "",
      dateTo: end ? end.toISOString().split("T")[0] : "",
    });
  };

  const startDate = value.dateFrom ? new Date(value.dateFrom + "T00:00:00") : null;
  const endDate = value.dateTo ? new Date(value.dateTo + "T00:00:00") : null;

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-scene-800/85 p-4 shadow-panel md:grid-cols-5">
      <input
        name="city"
        value={value.city}
        onChange={handleChange}
        placeholder="City"
        className={inputClass}
      />
      <input
        name="genre"
        value={value.genre}
        onChange={handleChange}
        placeholder="Genre"
        className={inputClass}
      />
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateRangeChange}
        placeholderText="Date range"
        isClearable
        className={inputClass + " w-full cursor-pointer"}
        wrapperClassName="w-full"
        dateFormat="MMM d, yyyy"
        portalId="datepicker-portal"
        popperPlacement="bottom-start"
      />
      <input
        name="venue"
        value={value.venue}
        onChange={handleChange}
        placeholder="Venue"
        className={inputClass}
      />
      <select
        name="price"
        value={value.price}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="" disabled hidden>Price range</option>
        <option value="all">All</option>
        <option value="50">Below ₪50</option>
        <option value="100">Below ₪100</option>
        <option value="150">Below ₪150</option>
        <option value="200">Below ₪200</option>
      </select>
    </div>
  );
}
