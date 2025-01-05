import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { TourFiltersModern } from "@/components/tour/TourFiltersModern";
import { TourTypeTabs } from "@/components/tour/TourTypeTabs";
import { TourCardModern } from "@/components/tour/TourCardModern";
import type { Tour, TourStatus } from "@/types/tour";
import { useNavigate } from "react-router-dom";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [sortBy, setSortBy] = useState("departure_asc");
  const [status, setStatus] = useState<TourStatus | "all">("planned");
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserType(user.user_metadata?.user_type);
      }
    };
    checkUserType();
  }, []);

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, tourType, sortBy, status],
    queryFn: async () => {
      let query = supabase
        .from("tours")
        .select(`
          *,
          carriers (
            company_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq("departure_country", departureCountry)
        .eq("destination_country", destinationCountry)
        .eq("type", tourType);

      if (status !== "all") {
        query = query.eq("status", status);
      }

      switch (sortBy) {
        case 'departure_asc':
          query = query.order('departure_date', { ascending: true });
          break;
        case 'departure_desc':
          query = query.order('departure_date', { ascending: false });
          break;
        case 'capacity_asc':
          query = query.order('remaining_capacity', { ascending: true });
          break;
        case 'capacity_desc':
          query = query.order('remaining_capacity', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string),
        carriers: {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers?.carrier_capacities) 
            ? tour.carriers.carrier_capacities 
            : [tour.carriers?.carrier_capacities]
        }
      })) as Tour[];
    },
  });

  const handleBookingClick = (tour: Tour) => {
    const pickupCity = tour.route[0]?.name;
    if (pickupCity) {
      navigate(`/reserver/${tour.id}?pickupCity=${encodeURIComponent(pickupCity)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Nos Tournées</h1>

        <TourFiltersModern
          departureCountry={departureCountry}
          destinationCountry={destinationCountry}
          sortBy={sortBy}
          status={status}
          onDepartureChange={setDepartureCountry}
          onDestinationChange={setDestinationCountry}
          onSortChange={setSortBy}
          onStatusChange={setStatus}
        />

        <TourTypeTabs
          tourType={tourType}
          publicToursCount={tours.filter(t => t.type === "public").length}
          privateToursCount={tours.filter(t => t.type === "private").length}
          onTypeChange={setTourType}
        />

        {isLoading ? (
          <div className="text-center py-8">Chargement des tournées...</div>
        ) : tours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune tournée disponible pour cette sélection
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCardModern
                key={tour.id}
                tour={tour}
                onBookingClick={() => handleBookingClick(tour)}
                isBookingEnabled={tour.status === "planned" && userType === "client"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}