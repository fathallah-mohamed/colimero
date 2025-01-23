import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tour } from "@/types/tour";

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
          const updatedTour = payload.new as Tour;
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
        setLocalTour(data as Tour);
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