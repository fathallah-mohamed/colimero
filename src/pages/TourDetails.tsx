import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TourCard } from "@/components/tour/TourCard";
import type { Tour, RouteStop, TourStatus } from "@/types/tour";
import type { BookingStatus } from "@/types/booking";

export default function TourDetails() {
  const { tourId } = useParams();

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      if (!tourId) throw new Error("Tour ID is required");
      
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            *,
            carrier_capacities (*)
          ),
          bookings (*)
        `)
        .eq("id", parseInt(tourId))
        .single();

      if (error) throw error;

      // Transform the route data to match the RouteStop[] type
      const transformedTour: Tour = {
        ...data,
        route: Array.isArray(data.route) 
          ? data.route 
          : typeof data.route === 'string' 
            ? JSON.parse(data.route) 
            : data.route,
        status: data.status as TourStatus,
        previous_status: data.previous_status as TourStatus | null,
        type: data.type,
        customs_declaration: Boolean(data.customs_declaration),
        terms_accepted: Boolean(data.terms_accepted),
        bookings: data.bookings?.map(booking => ({
          ...booking,
          status: booking.status as BookingStatus,
          special_items: Array.isArray(booking.special_items) 
            ? booking.special_items 
            : typeof booking.special_items === 'string'
              ? JSON.parse(booking.special_items)
              : [],
          content_types: booking.content_types || [],
          terms_accepted: Boolean(booking.terms_accepted),
          customs_declaration: Boolean(booking.customs_declaration)
        })) || []
      };

      return transformedTour;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Tournée non trouvée</h1>
        <p className="text-gray-600 mt-2">La tournée que vous recherchez n'existe pas.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TourCard tour={tour} />
    </div>
  );
}