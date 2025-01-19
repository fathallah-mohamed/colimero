import { useState, useEffect } from "react";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Booking } from "@/types/booking";

interface BookingStatusSectionProps {
  booking: Booking;
}

export function BookingStatusSection({ booking }: BookingStatusSectionProps) {
  const [localStatus, setLocalStatus] = useState(booking.status);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Mettre à jour le statut local quand le booking change
    setLocalStatus(booking.status);
  }, [booking.status]);

  useEffect(() => {
    console.log("Setting up realtime subscription for booking:", booking.id);
    
    const channel = supabase
      .channel(`booking_status_${booking.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${booking.id}`
        },
        (payload) => {
          console.log('Booking status updated:', payload);
          const newBooking = payload.new as Booking;
          setLocalStatus(newBooking.status);
          
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
  }, [booking.id, queryClient]);

  return <BookingStatusBadge status={localStatus} />;
}