import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFeatures } from "@/components/send-package/SendPackageFeatures";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { useTours } from "@/hooks/use-tours";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";

export default function EnvoyerColis() {
  const { toast } = useToast();
  const user = useUser();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmée");
  const [tourType, setTourType] = useState<"public" | "private">("public");

  const {
    tours,
    loading,
  } = useTours();

  const handleBooking = (tourId: number) => {
    if (!user?.id) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réserver une tournée",
        variant: "destructive",
      });
      return;
    }
    navigate(`/reserver/${tourId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <SendPackageHero />
          <SendPackageFeatures />
          
          <div className="mt-12">
            <SendPackageFilters
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              tourType={tourType}
              setTourType={setTourType}
            />

            {loading ? (
              <div className="text-center py-8">Chargement des tournées...</div>
            ) : tours && tours.length > 0 ? (
              <div className="grid gap-6 mt-6">
                {tours.map((tour) => (
                  <ClientTourCard
                    key={tour.id}
                    tour={tour}
                    onBookingClick={() => handleBooking(tour.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                Aucune tournée disponible pour les critères sélectionnés.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}