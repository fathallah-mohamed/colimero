import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TourCard } from "@/components/tour/TourCard";
import type { Tour, RouteStop, TourStatus } from "@/types/tour";

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
        type: data.type || "public",
        terms_accepted: data.terms_accepted || false,
        customs_declaration: data.customs_declaration || false
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