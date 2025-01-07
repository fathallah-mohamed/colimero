import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";
import { Tour, RouteStop } from "@/types/tour";

export default function Reserver() {
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
            company_name,
            first_name,
            last_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq("id", parseInt(tourId, 10))
        .single();

      if (error) throw error;

      // Transform the JSON route data into RouteStop array
      const transformedTour: Tour = {
        ...data,
        id: parseInt(data.id.toString(), 10),
        route: (data.route as any[]).map((stop): RouteStop => ({
          name: stop.name,
          location: stop.location,
          time: stop.time,
          type: stop.type,
          collection_date: stop.collection_date
        })),
        status: data.status as Tour['status']
      };

      return transformedTour;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <BookingForm 
        tourId={tour.id}
        pickupCity={tour.route[0].name}
        onSuccess={() => {
          // Handle success
        }}
      />
    </div>
  );
}