import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import TourPageHeader from "@/components/tour/TourPageHeader";
import TourPageContent from "@/components/tour/TourPageContent";
import { TourAuthDialogs } from "@/components/tour/auth/TourAuthDialogs";
import type { Tour, TourStatus } from "@/types/tour";

export default function EnvoyerColis() {
  const [departureCountry, setDepartureCountry] = useState("FR");
  const [destinationCountry, setDestinationCountry] = useState("TN");
  const [tourType, setTourType] = useState("public");
  const [sortBy, setSortBy] = useState("departure_asc");
  const [status, setStatus] = useState<TourStatus | "all">("planned");
  const [userType, setUserType] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const { data: publicTours = [], isLoading: isLoadingPublic } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, "public", sortBy, status],
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
        .eq("type", "public");

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

  const { data: privateTours = [], isLoading: isLoadingPrivate } = useQuery({
    queryKey: ["tours", departureCountry, destinationCountry, "private", sortBy, status],
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
        .eq("type", "private");

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

  const handleDepartureChange = (value: string) => {
    setDepartureCountry(value);
    if (["TN", "DZ", "MA"].includes(value)) {
      setDestinationCountry("FR");
    }
  };

  const handleAuthRequired = () => {
    setShowAuthDialog(true);
    setShowRegisterForm(false);
  };

  const handleRegisterClick = () => {
    setShowAuthDialog(false);
    setShowRegisterForm(true);
  };

  const handleLoginClick = () => {
    setShowRegisterForm(false);
    setShowAuthDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <TourPageHeader />
        
        <TourPageContent
          departureCountry={departureCountry}
          destinationCountry={destinationCountry}
          sortBy={sortBy}
          status={status}
          tourType={tourType}
          publicTours={publicTours}
          privateTours={privateTours}
          isLoadingPublic={isLoadingPublic}
          isLoadingPrivate={isLoadingPrivate}
          userType={userType}
          onDepartureChange={handleDepartureChange}
          onDestinationChange={setDestinationCountry}
          onSortChange={setSortBy}
          onStatusChange={(value) => setStatus(value as TourStatus | "all")}
          onTypeChange={setTourType}
          onAuthRequired={handleAuthRequired}
        />

        <TourAuthDialogs 
          showAuthDialog={showAuthDialog}
          showRegisterForm={showRegisterForm}
          onAuthClose={() => setShowAuthDialog(false)}
          onRegisterClose={() => setShowRegisterForm(false)}
          onRegisterClick={handleRegisterClick}
          onLoginClick={handleLoginClick}
        />
      </div>
    </div>
  );
}
