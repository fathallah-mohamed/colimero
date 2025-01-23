import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tour, RouteStop, TourStatus, TourType } from "@/types/tour";
import { Json } from "@/types/database/tables";

interface RawTourData {
  id: number;
  carrier_id: string;
  route: Json;
  total_capacity: number;
  remaining_capacity: number;
  departure_date: string;
  collection_date: string;
  created_at: string;
  updated_at: string;
  departure_country: string;
  destination_country: string;
  status: string;
  type: string;
  previous_status: string | null;
  terms_accepted: boolean;
  customs_declaration: boolean;
  tour_number?: string;
  bookings?: any[];
  carriers?: {
    company_name: string;
    avatar_url: string;
    carrier_capacities: {
      price_per_kg: number;
    }
  };
}

const parseRouteData = (routeData: Json): RouteStop[] => {
  if (!Array.isArray(routeData)) return [];
  
  return routeData.map((stop: any) => ({
    name: stop.name,
    location: stop.location,
    time: stop.time,
    type: stop.type,
    collection_date: stop.collection_date
  }));
};

const transformTourData = (rawTour: RawTourData): Tour => {
  const routeData = typeof rawTour.route === 'string' 
    ? JSON.parse(rawTour.route) 
    : rawTour.route;

  return {
    id: rawTour.id,
    carrier_id: rawTour.carrier_id,
    route: parseRouteData(routeData),
    total_capacity: rawTour.total_capacity,
    remaining_capacity: rawTour.remaining_capacity,
    departure_date: rawTour.departure_date,
    collection_date: rawTour.collection_date,
    created_at: rawTour.created_at,
    updated_at: rawTour.updated_at,
    departure_country: rawTour.departure_country,
    destination_country: rawTour.destination_country,
    status: rawTour.status as TourStatus,
    type: rawTour.type as TourType,
    previous_status: rawTour.previous_status as TourStatus | null,
    terms_accepted: rawTour.terms_accepted,
    customs_declaration: rawTour.customs_declaration,
    tour_number: rawTour.tour_number,
    bookings: rawTour.bookings || [],
    carriers: rawTour.carriers
  };
};

export function useTourRealtime(tourId: number) {
  const [localTour, setLocalTour] = useState<Tour | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Setting up tour realtime subscription for:", tourId);
    
    const channel = supabase
      .channel(`tour_${tourId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours',
          filter: `id=eq.${tourId}`
        },
        (payload) => {
          console.log('Tour updated:', payload);
          
          if (payload.new) {
            const updatedTour = transformTourData(payload.new as RawTourData);
            setLocalTour(updatedTour);
            
            // Invalider tous les caches liés aux tournées
            queryClient.invalidateQueries({ queryKey: ['tours'] });
            queryClient.invalidateQueries({ queryKey: ['next-tour'] });
            
            // Mettre à jour le cache spécifique à cette tournée
            queryClient.setQueryData(['tour', tourId], updatedTour);
          }
        }
      )
      .subscribe((status) => {
        console.log("Tour subscription status:", status);
      });

    // Récupérer l'état initial de la tournée
    const fetchInitialTourState = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*, carriers(company_name, avatar_url, carrier_capacities(price_per_kg))')
        .eq('id', tourId)
        .single();
        
      if (!error && data) {
        const initialTour = transformTourData(data as RawTourData);
        setLocalTour(initialTour);
      }
    };

    fetchInitialTourState();

    return () => {
      console.log("Cleaning up tour realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [tourId, queryClient]);

  return localTour;
}