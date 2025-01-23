import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tour, TourStatus, TourType } from "@/types/tour";
import { parseRouteData } from "@/utils/tour/routeParser";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface TourPayload {
  route: any;
  status: TourStatus;
  type: TourType;
  previous_status: TourStatus | null;
  [key: string]: any;
}

interface RealtimePayload {
  new: TourPayload;
}

export function useTourRealtime(tourId: number) {
  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (!tourId) return;

    console.log("Setting up realtime subscription for tour:", tourId);

    const channel = supabase
      .channel('tour-updates')
      .on<RealtimePayload>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours',
          filter: `id=eq.${tourId}`
        },
        (payload: RealtimePostgresChangesPayload<RealtimePayload>) => {
          if (!payload.new || typeof payload.new !== 'object') return;

          const updatedTour = {
            ...payload.new,
            route: parseRouteData(payload.new.route),
            status: payload.new.status as Tour['status'],
            type: payload.new.type as Tour['type'],
            previous_status: payload.new.previous_status as Tour['status'] | null,
          } as Tour;

          console.log("Received realtime update for tour:", updatedTour);
          setTour(updatedTour);
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription for tour:", tourId);
      supabase.removeChannel(channel);
    };
  }, [tourId]);

  return tour;
}