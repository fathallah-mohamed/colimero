import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { AlertCircle, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SenderRecipient {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface BookingWithRelations {
  id: string;
  user_id: string;
  tour_id: number;
  status: BookingStatus;
  created_at: string;
  // ... other booking fields
  sender: SenderRecipient;
  recipient: SenderRecipient;
  tours: {
    collection_date: string;
    departure_date: string;
    destination_country: string;
    route: any;
    status: string;
    carriers?: {
      company_name: string;
      avatar_url: string;
      phone: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export function BookingList() {
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching bookings for user:", user.id);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          tours (
            collection_date,
            departure_date,
            destination_country,
            route,
            status,
            carriers (
              company_name,
              avatar_url,
              phone,
              first_name,
              last_name,
              email
            )
          ),
          sender:clients!bookings_user_id_fkey (
            id,
            email,
            first_name,
            last_name
          ),
          recipient:clients!bookings_recipient_id_fkey (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      console.log("Fetched bookings:", data);
      
      return (data as BookingWithRelations[])?.map(booking => ({
        ...booking,
        sender_email: booking.sender?.email,
        recipient_email: booking.recipient?.email,
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
      console.log("Updating booking status:", { bookingId, newStatus });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', bookingId);

      if (error) {
        console.error("Error updating booking status:", error);
        throw error;
      }
      
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
