import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFeatures } from "@/components/send-package/SendPackageFeatures";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { TourTypeTabs } from "@/components/tour/TourTypeTabs";
import { TourTimelineCard } from "@/components/transporteur/TourTimelineCard";
import { useTourData } from "@/hooks/use-tour-data";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmé");
  const [tourType, setTourType] = useState<"public" | "private">("public");

  const {
    showAuthDialog,
    setShowAuthDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const { tours, loading: isLoading } = useTourData({
    departureCountry: selectedRoute === "FR_TO_TN" ? "FR" : "TN",
    destinationCountry: selectedRoute === "FR_TO_TN" ? "TN" : "FR",
    sortBy: "departure_asc",
    status: selectedStatus as any
  });

  const handleTourClick = (tourId: number, pickupCity: string) => {
    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  // Séparer les tournées programmées des autres
  const plannedTours = tours?.filter(tour => tour.status === "Programmée") || [];
  const otherTours = tours?.filter(tour => tour.status !== "Programmée") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SendPackageHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <SendPackageFeatures />
          
          <div className="mb-6">
            <TourTypeTabs
              tourType={tourType}
              publicToursCount={tours?.filter(t => t.type === "public").length || 0}
              privateToursCount={tours?.filter(t => t.type === "private").length || 0}
              onTypeChange={setTourType}
            />
          </div>

          <SendPackageFilters
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Chargement des tournées...</div>
          ) : tours?.length === 0 ? (
            <div className="text-center py-8">Aucune tournée disponible</div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Tournées programmées</h2>
                <div className="space-y-4">
                  {plannedTours.map((tour) => (
                    <TourTimelineCard
                      key={tour.id}
                      tour={tour}
                      onBookingClick={handleTourClick}
                    />
                  ))}
                  {plannedTours.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune tournée programmée disponible
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Autres tournées</h2>
                <div className="space-y-4">
                  {otherTours.map((tour) => (
                    <TourTimelineCard
                      key={tour.id}
                      tour={tour}
                      onBookingClick={handleTourClick}
                    />
                  ))}
                  {otherTours.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune autre tournée disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
        requiredUserType="client"
      />
    </div>
  );
}