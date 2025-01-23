import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tour, RouteStop } from "@/types/tour";
import { Json } from "@/types/database/tables";

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
          
          // Transformer les données reçues en type Tour
          const rawTour = payload.new;
          const routeData = typeof rawTour.route === 'string' 
            ? JSON.parse(rawTour.route) 
            : rawTour.route;

          const parsedRoute: RouteStop[] = Array.isArray(routeData) 
            ? routeData.map((stop: any) => ({
                name: stop.name,
                location: stop.location,
                time: stop.time,
                type: stop.type,
                collection_date: stop.collection_date
              }))
            : [];

          const updatedTour: Tour = {
            ...rawTour,
            route: parsedRoute,
            type: rawTour.type as Tour['type'],
            status: rawTour.status as Tour['status'],
          };

          setLocalTour(updatedTour);
          
          // Invalider tous les caches liés aux tournées
          queryClient.invalidateQueries({ queryKey: ['tours'] });
          queryClient.invalidateQueries({ queryKey: ['next-tour'] });
          
          // Mettre à jour le cache spécifique à cette tournée
          queryClient.setQueryData(['tour', tourId], updatedTour);
        }
      )
      .subscribe((status) => {
        console.log("Tour subscription status:", status);
      });

    // Récupérer l'état initial de la tournée
    const fetchInitialTourState = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();
        
      if (!error && data) {
        // Appliquer la même transformation pour l'état initial
        const routeData = typeof data.route === 'string' 
          ? JSON.parse(data.route) 
          : data.route;

        const parsedRoute: RouteStop[] = Array.isArray(routeData) 
          ? routeData.map((stop: any) => ({
              name: stop.name,
              location: stop.location,
              time: stop.time,
              type: stop.type,
              collection_date: stop.collection_date
            }))
          : [];

        const initialTour: Tour = {
          ...data,
          route: parsedRoute,
          type: data.type as Tour['type'],
          status: data.status as Tour['status'],
        };

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