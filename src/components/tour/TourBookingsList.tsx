import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "../booking/BookingCard";
import type { BookingStatus } from "@/types/booking";

interface TourBookingsListProps {
  tourId: number;
  tourStatus: string;
}

export function TourBookingsList({ tourId, tourStatus }: TourBookingsListProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchBookings();
  }, [tourId]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    console.log("Status change requested:", bookingId, newStatus);
    await fetchBookings();
  };

  const handleUpdate = async () => {
    console.log("Update requested, fetching bookings...");
    await fetchBookings();
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>Aucune réservation pour cette tournée.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isCollecting={tourStatus === "collecting"}
            onStatusChange={handleStatusChange}
            onUpdate={handleUpdate}
            isEven={index % 2 === 0}
            tourStatus={tourStatus}
          />
        ))
      )}
    </div>
  );
}