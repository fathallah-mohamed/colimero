import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { AlertCircle, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types/booking";

export function BookingList() {
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    console.log("Status change requested:", bookingId, newStatus);
    // The actual update is handled in the BookingCard component
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune réservation
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas encore effectué de réservation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking, index) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isCollecting={true}
          onStatusChange={handleStatusChange}
          onUpdate={refetch}
          isEven={index % 2 === 0}
        />
      ))}
    </div>
  );
}