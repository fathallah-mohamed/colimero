import { useState } from "react";
import { useTours } from "@/hooks/use-tours";
import ClientTourCard from "@/components/send-package/tour/ClientTourCard";
import SendPackageHero from "@/components/send-package/SendPackageHero";
import SendPackageFeatures from "@/components/send-package/SendPackageFeatures";
import SendPackageFilters from "@/components/send-package/SendPackageFilters";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Tour, RouteStop } from "@/types/tour";

export default function EnvoyerColis() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [departureCountry, setDepartureCountry] = useState<string>("FR");
  const [destinationCountry, setDestinationCountry] = useState<string>("TN");
  const [sortBy, setSortBy] = useState<string>("departure_date");
  const [tourType, setTourType] = useState<"public" | "private">("public");

  const {
    tours: rawTours,
    loading,
  } = useTours();

  // Transform the tours data to match the expected types
  const tours = rawTours?.map(tour => ({
    ...tour,
    route: Array.isArray(tour.route) 
      ? tour.route.map((stop: any): RouteStop => ({
          name: stop.name,
          location: stop.location,
          time: stop.time,
          type: stop.type,
          collection_date: stop.collection_date
        }))
      : [],
  })) as Tour[];

  const handleBooking = (tourId: number, pickupCity: string) => {
    // Store the current path in sessionStorage before redirecting to login
    sessionStorage.setItem('returnPath', `/reserver/${tourId}`);
    
    navigate(`/reserver/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <SendPackageHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SendPackageFeatures />
        
        <div className="mt-12">
          <SendPackageFilters
            departureCountry={departureCountry}
            destinationCountry={destinationCountry}
            sortBy={sortBy}
            tourType={tourType}
            onDepartureCountryChange={setDepartureCountry}
            onDestinationCountryChange={setDestinationCountry}
            onSortByChange={setSortBy}
            onTourTypeChange={setTourType}
          />

          <div className="mt-8">
            {loading ? (
              <div className="text-center">Chargement des tournées...</div>
            ) : tours && tours.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                  <ClientTourCard
                    key={tour.id}
                    tour={tour}
                    onBookingClick={handleBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Aucune tournée disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}