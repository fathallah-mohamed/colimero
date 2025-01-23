import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tour } from "@/types/tour";
import { parseRouteData } from "@/utils/tour/routeParser";

interface RealtimePayload {
  new: {
    route: any;
    status: Tour['status'];
    type: Tour['type'];
    previous_status: Tour['status'] | null;
    [key: string]: any;
  };
}

export function useTourRealtime(tourId: number) {
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (!tourId) return;

    const channel = supabase
      .channel('tour-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours',
          filter: `id=eq.${tourId}`
        },
        (payload: RealtimePayload) => {
          if (!payload.new) return;

          const updatedTour = {
            ...payload.new,
            route: parseRouteData(payload.new.route),
            status: payload.new.status as Tour['status'],
            type: payload.new.type as Tour['type'],
            previous_status: payload.new.previous_status as Tour['status'] | null,
          } as Tour;

          setTour(updatedTour);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tourId]);

  return tour;
}