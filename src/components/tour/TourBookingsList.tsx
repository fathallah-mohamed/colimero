import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "../booking/BookingCard";
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
    console.log("Fetching bookings for tour:", tourId);
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        tours (
          departure_date,
          destination_country,
          carriers (
            company_name,
            avatar_url
          )
        )
      `)
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

    console.log("Bookings fetched:", data);
    setBookings(data || []);
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    console.log("Changing status to:", newStatus, "for booking:", bookingId);
    
    const { error } = await supabase
      .from("bookings")
      .update({ 
        status: newStatus,
        delivery_status: newStatus // Keep sync with old field for compatibility
      })
      .eq("id", bookingId);

    if (error) {
      console.error("Error updating booking status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return;
    }

    // Rafraîchir les données après la mise à jour
    await fetchBookings();

    toast({
      title: "Succès",
      description: `Le statut a été mis à jour en "${newStatus}"`,
    });
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