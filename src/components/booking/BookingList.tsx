import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingCard } from "./BookingCard";
import { AlertCircle, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useUser } from "@supabase/auth-helpers-react";

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
  pickup_city: string;
  delivery_city: string;
  tracking_number: string;
  weight: number;
  item_type: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  sender_name: string | null;
  sender_phone: string | null;
  delivery_status: string | null;
  delivery_notes: string | null;
  terms_accepted: boolean | null;
  customs_declaration: boolean | null;
  package_description: string | null;
  special_items: Array<{ name: string; quantity: number }>;
  content_types: string[] | null;
  photos: string[] | null;
  sender: SenderRecipient | null;
  recipient: SenderRecipient | null;
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
  } | null;
}

export function BookingList() {
  const user = useUser();
  
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching bookings for user:", user.id);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          sender:user_id (
            id,
            email,
            first_name,
            last_name
          ),
          recipient:recipient_id (
            id,
            email,
            first_name,
            last_name
          ),
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
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      console.log("Fetched bookings:", data);
      
      return (data as unknown as BookingWithRelations[])?.map(booking => ({
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
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erreur lors du chargement des réservations
        </h3>
        <p className="text-gray-500">
          Une erreur est survenue lors du chargement de vos réservations. Veuillez réessayer.
        </p>
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
          onStatusChange={async () => {}}
          onUpdate={async () => {}}
          isEven={false}
        />
      ))}
    </div>
  );
}