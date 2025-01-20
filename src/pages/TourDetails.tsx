import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour, RouteStop, TourStatus } from "@/types/tour";
import { BookingStatus } from "@/types/booking";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { Loader2 } from "lucide-react";

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

      // Transform the route from Json to RouteStop[]
      const transformedTour: Tour = {
        ...data,
        route: Array.isArray(data.route) 
          ? data.route.map((stop: any) => ({
              name: stop.name || "",
              location: stop.location || "",
              time: stop.time || "",
              type: stop.type || "pickup"
            } as RouteStop))
          : [],
        status: data.status as TourStatus,
        previous_status: data.previous_status as TourStatus | null,
        type: data.type || "public",
        terms_accepted: data.terms_accepted || false,
        customs_declaration: data.customs_declaration || false,
        bookings: data.bookings?.map((booking: any) => ({
          ...booking,
          status: booking.status as BookingStatus
        }))
      };

      return transformedTour;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <ClientTourCard tour={tour} />
    </div>
  );
}