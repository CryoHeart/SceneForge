import { useMemo, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AppStates";
import { EventCard } from "../components/EventCard";
import { FilterBar } from "../components/FilterBar";
import { useEvents } from "../hooks/useEvents";
import { SectionHeader } from "../components/SectionHeader";
import type { Event, FilterState } from "../types";
import { toDateInputValue } from "../utils/dateUtils";

const initialFilters: FilterState = {
  city: "",
  genre: "",
  dateFrom: "",
  dateTo: "",
  venue: "",
  price: "",
};

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function EventsPage() {
  const { events, isLoading, hasError, refetchEvents } = useEvents();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFiltersChange = (nextFilters: FilterState) => {
    setFilters({
      ...nextFilters,
      dateFrom: nextFilters.dateFrom ? toDateInputValue(nextFilters.dateFrom) : "",
      dateTo: nextFilters.dateTo ? toDateInputValue(nextFilters.dateTo) : "",
    });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const cityMatch = filters.city ? event.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
      const genreMatch = filters.genre ? event.genre.toLowerCase().includes(filters.genre.toLowerCase()) : true;
      const venueMatch = filters.venue
        ? (event.venue?.name ?? "").toLowerCase().includes(filters.venue.toLowerCase())
        : true;
      const priceMatch = filters.price && filters.price !== "all" ? Number(event.price) <= Number(filters.price) : true;
      const eventDate = toDateInputValue(event.startsAt);
      const dateFromMatch = filters.dateFrom ? eventDate >= filters.dateFrom : true;
      const dateToMatch = filters.dateTo ? eventDate <= filters.dateTo : true;

      return cityMatch && genreMatch && venueMatch && priceMatch && dateFromMatch && dateToMatch;
    });
  }, [events, filters]);

  const groupedEvents = useMemo(() => {
    const sortedEvents = [...filteredEvents].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );

    const groups: Array<{ key: string; label: string; events: Event[] }> = [];

    sortedEvents.forEach((event) => {
      const date = new Date(event.startsAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = monthLabelFormatter.format(date);
      const existingGroup = groups[groups.length - 1];

      if (!existingGroup || existingGroup.key !== key) {
        groups.push({ key, label, events: [event] });
        return;
      }

      existingGroup.events.push(event);
    });

    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Explore"
        title="Events"
        subtitle="Filter by city, genre, date, venue, and price to find your next show."
      />
      <FilterBar value={filters} onChange={handleFiltersChange} />

      {isLoading && <LoadingState title="Loading events..." />}

      {hasError && (
        <ErrorState
          title="Could not load events"
          description="Please check your connection and retry."
          actionLabel="Retry"
          onAction={refetchEvents}
        />
      )}

      {!isLoading && !hasError && filteredEvents.length === 0 && (
        <EmptyState
          title="No events match these filters"
          description="Try relaxing a filter or clearing date and price constraints."
        />
      )}

      {!isLoading && !hasError && groupedEvents.length > 0 && (
        <div className="space-y-8">
          {groupedEvents.map((group) => (
            <section key={group.key} className="space-y-4">
              <h3 className="font-display text-2xl text-white sm:text-3xl">{group.label}</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
