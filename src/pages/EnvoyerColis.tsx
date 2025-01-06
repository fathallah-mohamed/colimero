import Navigation from "@/components/Navigation";
import { TourFilters } from "@/components/tour/TourFilters";
import { ToursList } from "@/components/tour/ToursList";
import { useTours } from "@/hooks/use-tours";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const {
    loading,
    tours,
    departureCountry,
    destinationCountry,
    sortBy,
    status,
    setDepartureCountry,
    setDestinationCountry,
    setSortBy,
    setStatus,
    handleDelete,
    handleEdit,
    handleStatusChange,
  } = useTours();

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
    // Set initial status to "Programmé" when component mounts
    setStatus("Programmé");
  }, [setStatus]);

  console.log('EnvoyerColis rendered with tours:', tours);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <TourFilters
              departureCountry={departureCountry}
              destinationCountry={destinationCountry}
              sortBy={sortBy}
              status={status}
              onDepartureChange={setDepartureCountry}
              onDestinationChange={setDestinationCountry}
              onSortChange={setSortBy}
              onStatusChange={setStatus}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ToursList
              tours={tours}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}