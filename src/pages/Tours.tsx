import Navigation from "@/components/Navigation";
import { TourHeader } from "@/components/tour/TourHeader";
import { TourContent } from "@/components/tour/TourContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "@/types/tour";
import { useTourFilters } from "@/hooks/use-tour-filters";

export default function Tours() {
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

  const isCollectingPhase = (status: TourStatus) => {
    return status === "Ramassage en cours";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TourHeader />
        <div className="mt-8">
          <TourContent 
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            sortBy={sortBy}
            status={status}
            setDepartureCountry={setDepartureCountry}
            setDestinationCountry={setDestinationCountry}
            setSortBy={setSortBy}
            setStatus={setStatus}
            isCollectingPhase={isCollectingPhase}
          />
        </div>
      </div>
    </div>
  );
}
