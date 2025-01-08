import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { useTours } from "@/hooks/use-tours";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

export default function EnvoyerColis() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmée");
  const {
    data: tours,
    isLoading,
    error,
  } = useTours();

  const handleBooking = (tourId: number) => {
    navigate(`/reserver/${tourId}`);
  };

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
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours?.map((tour) => (
            <ClientTourCard
              key={tour.id}
              tour={tour}
              onBookingClick={() => handleBooking(tour.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}