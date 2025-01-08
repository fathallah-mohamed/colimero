import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { useNavigate } from "react-router-dom";
import { Tour, RouteStop } from "@/types/tour";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const tourId = searchParams.get("tourId");

  const { data: tours, isLoading } = useQuery({
    queryKey: ["available-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            id,
            company_name,
            avatar_url,
            carrier_capacities (*)
          )
        `)
        .eq("status", "planned")
        .order("departure_date", { ascending: true });

      if (error) throw error;
      
      // Transform the data to match the Tour type
      return (data || []).map(tour => ({
        ...tour,
        route: tour.route as RouteStop[], // Cast the JSON route to RouteStop[]
        carriers: tour.carriers ? {
          company_name: tour.carriers.company_name,
          avatar_url: tour.carriers.avatar_url,
          carrier_capacities: tour.carriers.carrier_capacities
        } : undefined
      })) as Tour[];
    },
  });

  const handleBookingClick = (tourId: number, pickupCity: string) => {
    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tournées disponibles</h1>
      <div className="space-y-4">
        {tours?.map((tour) => (
          <ClientTourCard
            key={tour.id}
            tour={tour}
            onBookingClick={handleBookingClick}
          />
        ))}
        {tours?.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Aucune tournée disponible pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}