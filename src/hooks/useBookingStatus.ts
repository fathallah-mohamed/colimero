import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BookingStatus } from "@/types/booking";

export function useBookingStatus(initialStatus: BookingStatus) {
  const [status, setStatus] = useState<BookingStatus>(initialStatus);
  const queryClient = useQueryClient();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    console.log("Setting up realtime subscription for booking status:", status);
    
    const channel = supabase
      .channel(`booking_status_${status}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `status=eq.${status}`
        },
        (payload) => {
          console.log('Booking status updated:', payload);
          const newStatus = payload.new.status as BookingStatus;
          setStatus(newStatus);
          
          // Invalider le cache pour forcer le rechargement
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          queryClient.invalidateQueries({ queryKey: ['next-tour'] });
          queryClient.invalidateQueries({ queryKey: ['tours'] });
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [status, queryClient]);

  return status;
}