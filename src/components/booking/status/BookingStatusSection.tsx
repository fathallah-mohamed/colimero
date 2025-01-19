import { BookingStatusBadge } from "../BookingStatusBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Booking, BookingStatus } from "@/types/booking";

interface BookingStatusSectionProps {
  booking: Booking;
}

export function BookingStatusSection({ booking }: BookingStatusSectionProps) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const queryClient = useQueryClient();

  useEffect(() => {
    setStatus(booking.status);
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
  }, [booking.id, queryClient]);

  return <BookingStatusBadge status={status} />;
}