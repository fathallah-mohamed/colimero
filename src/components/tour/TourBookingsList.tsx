import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "./booking/BookingCard";
import type { Database } from "@/integrations/supabase/types";
import type { BookingStatus } from "@/types/booking";

interface TourBookingsListProps {
  tourId: number;
  tourStatus: string;
}

export function TourBookingsList({ tourId, tourStatus }: TourBookingsListProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [tourId]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tour_id", tourId);

    if (error) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les réservations",
      });
      return;
    }

    setBookings(data || []);
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Le statut a été mis à jour",
    });

    fetchBookings();
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>Aucune réservation pour cette tournée.</p>
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isCollecting={tourStatus === "collecting"}
            onStatusChange={handleStatusChange}
            onUpdate={fetchBookings}
          />
        ))
      )}
    </div>
  );
}