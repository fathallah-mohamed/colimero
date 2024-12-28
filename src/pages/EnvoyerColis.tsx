import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { TourFilters } from "@/components/tour/TourFilters";
import { TourTypeTabs } from "@/components/tour/TourTypeTabs";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import type { Tour } from "@/types/tour";

export default function EnvoyerColis() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");

  // Séparer les requêtes pour les tournées publiques et privées
  const { data: publicTours = [], isLoading: isLoadingPublic } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, "public"],
    queryFn: async () => {
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
        .eq("type", "public")
        .order("departure_date", { ascending: true });

      if (error) throw error;
      
      // Parse the route JSON into proper RouteStop array
      return data.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string)
      })) as Tour[];
    },
  });

  const { data: privateTours = [], isLoading: isLoadingPrivate } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, "private"],
    queryFn: async () => {
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
        .eq("type", "private")
        .order("departure_date", { ascending: true });

      if (error) throw error;
      
      // Parse the route JSON into proper RouteStop array
      return data.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string)
      })) as Tour[];
    },
  });

  const handleDepartureChange = (value: string) => {
    setDepartureCountry(value);
    // Si le pays de départ est un pays du Maghreb, forcer la destination à la France
    if (["TN", "DZ", "MA"].includes(value)) {
      setDestinationCountry("FR");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
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

          {tourType === "public" ? (
            <TransporteurTours 
              tours={publicTours} 
              type="public" 
              isLoading={isLoadingPublic}
            />
          ) : (
            <TransporteurTours 
              tours={privateTours} 
              type="private"
              isLoading={isLoadingPrivate}
            />
          )}
        </div>
      </div>
    </div>
  );
}