import Navigation from "@/components/Navigation";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TourFilters } from "@/components/tour/TourFilters";
import { TourList } from "@/components/tour/TourList";
import { useTourFilters } from "@/hooks/use-tour-filters";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const {
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
  } = useTourFilters();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/connexion');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    setStatus("Programmé");
  }, [setStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TourFilters
          departureCountry={departureCountry}
          destinationCountry={destinationCountry}
          sortBy={sortBy}
          status={status}
          setDepartureCountry={setDepartureCountry}
          setDestinationCountry={setDestinationCountry}
          setSortBy={setSortBy}
          setStatus={setStatus}
        />
        <TourList
          departureCountry={departureCountry}
          destinationCountry={destinationCountry}
          sortBy={sortBy}
          status={status}
        />
      </div>
    </div>
  );
}
