import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { useTours } from "@/hooks/use-tours";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useBookingFlow } from "@/hooks/useBookingFlow";

export default function EnvoyerColis() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmée");
  const [tourType, setTourType] = useState<"public" | "private">("public");
  
  const {
    loading,
    tours,
  } = useTours();

  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SendPackageHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SendPackageFilters
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          tourType={tourType}
          setTourType={setTourType}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours?.map((tour) => (
            <ClientTourCard
              key={tour.id}
              tour={tour}
              onBookingClick={handleBookingClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}