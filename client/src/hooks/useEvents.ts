import { useCallback, useEffect, useState } from "react";
import { getEvents } from "../services/api";
import type { Event } from "../types";

type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  hasError: boolean;
  refetchEvents: () => Promise<void>;
};

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const refetchEvents = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const nextEvents = await getEvents();
      setEvents(nextEvents);
    } catch (error) {
      console.error("[SceneForge] Failed to refresh events.", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchEvents();
  }, [refetchEvents]);

  return {
    events,
    isLoading,
    hasError,
    refetchEvents,
  };
}
