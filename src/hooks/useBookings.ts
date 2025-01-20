import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Booking } from "@/types/booking";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found in useBookings");
        return [];
      }

      console.log("Fetching bookings for user:", session.user.id);

      // First fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
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
            carrier_id
          )
        `)
        .eq("user_id", session.user.id)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        throw bookingsError;
      }

      // Then fetch carriers data for the tours
      const bookingsWithCarriers = await Promise.all(
        (bookingsData || []).map(async (booking) => {
          if (booking.tours?.carrier_id) {
            const { data: carrierData } = await supabase
              .from("carriers")
              .select(`
                company_name,
                avatar_url,
                phone,
                first_name,
                last_name,
                email
              `)
              .eq("id", booking.tours.carrier_id)
              .single();

            return {
              ...booking,
              tours: {
                ...booking.tours,
                carriers: carrierData
              }
            };
          }
          return booking;
        })
      );

      console.log("Raw bookings data:", bookingsWithCarriers);
      
      if (!bookingsWithCarriers) {
        console.log("No bookings found");
        return [];
      }

      const formattedBookings = bookingsWithCarriers.map((booking: any) => {
        let specialItems = [];
        try {
          if (typeof booking.special_items === 'string') {
            specialItems = JSON.parse(booking.special_items);
          } else {
            specialItems = booking.special_items || [];
          }
        } catch (e) {
          console.error('Error parsing special_items:', e);
          specialItems = [];
        }

        return {
          ...booking,
          special_items: specialItems,
          created_at_formatted: format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr }),
          departure_date_formatted: booking.tours?.departure_date 
            ? format(new Date(booking.tours.departure_date), "d MMMM yyyy", { locale: fr })
            : null,
          collection_date_formatted: booking.tours?.collection_date
            ? format(new Date(booking.tours.collection_date), "d MMMM yyyy", { locale: fr })
            : null
        };
      });

      console.log("Formatted bookings for user:", session.user.id, formattedBookings);
      return formattedBookings;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}