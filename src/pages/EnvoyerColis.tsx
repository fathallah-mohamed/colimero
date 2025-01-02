import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { TourFilters } from "@/components/tour/TourFilters";
import { TourTypeTabs } from "@/components/tour/TourTypeTabs";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import type { Tour, TourType } from "@/types/tour";

export default function EnvoyerColis() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState<TourType>("public");

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, tourType],
    queryFn: async () => {
      console.log("Fetching tours with type:", tourType); // Debug log

      const { data, error } = await supabase
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
        .eq("type", tourType)
        .gte("departure_date", new Date().toISOString())
        .order("departure_date", { ascending: true });

      if (error) {
        console.error("Supabase error:", error); // Debug log
        throw error;
      }
      
      console.log("Fetched tours:", data); // Debug log

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

  const publicTours = tours.filter(tour => tour.type === "public");
  const privateTours = tours.filter(tour => tour.type === "private");

  const handleDepartureChange = (value: string) => {
    setDepartureCountry(value);
    if (["TN", "DZ", "MA"].includes(value)) {
      setDestinationCountry("FR");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Nos Tournées</h1>

        <div className="space-y-6">
          <TourFilters
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            onDepartureChange={handleDepartureChange}
            onDestinationChange={setDestinationCountry}
          />

          <TourTypeTabs
            tourType={tourType}
            publicToursCount={publicTours.length}
            privateToursCount={privateTours.length}
            onTypeChange={setTourType}
          />

          <TransporteurTours 
            tours={tourType === "public" ? publicTours : privateTours}
            type={tourType}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}