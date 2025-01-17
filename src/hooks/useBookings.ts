import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function useBookings() {
  const user = useUser();

  return useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user found in useBookings");
        return [];
      }

      console.log("Fetching bookings for user:", user.id);

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select(`
          *,
          tours (
            id,
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
        .eq("user_id", user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      console.log("Raw bookings data:", bookingsData);
      
      if (!bookingsData) {
        console.log("No bookings found");
        return [];
      }

      const formattedBookings = bookingsData.map((booking: any) => ({
        ...booking,
        special_items: Array.isArray(booking.special_items) 
          ? booking.special_items.map((item: any) => {
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

      console.log("Formatted bookings:", formattedBookings);
      return formattedBookings;
    },
    enabled: !!user,
  });
}