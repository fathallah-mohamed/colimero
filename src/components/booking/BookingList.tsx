import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { AlertCircle, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function BookingList() {
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          tours (
            collection_date,
            departure_date,
            destination_country,
            route,
            carriers (
              company_name,
              avatar_url,
              phone,
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
      
      return data?.map(booking => ({
        ...booking,
        special_items: Array.isArray(booking.special_items) 
          ? booking.special_items.map(item => {
              if (typeof item === 'string') return { name: item, quantity: 1 };
              return item;
            })
          : [],
        created_at_formatted: format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr }),
        departure_date_formatted: booking.tours?.departure_date 
          ? format(new Date(booking.tours.departure_date), "d MMMM yyyy", { locale: fr })
          : null,
        collection_date_formatted: booking.tours?.collection_date
          ? format(new Date(booking.tours.collection_date), "d MMMM yyyy", { locale: fr })
          : null
      }));
    },
  });

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleUpdate = async (): Promise<void> => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isCollecting={true}
          onStatusChange={handleStatusChange}
          onUpdate={handleUpdate}
          isEven={false}
        />
      ))}
    </div>
  );
}