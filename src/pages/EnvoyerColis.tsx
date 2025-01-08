import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { ClientTourCard } from "@/components/send-package/tour/ClientTourCard";
import { useTours } from "@/hooks/use-tours";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import AuthDialog from "@/components/auth/AuthDialog";
import { Package2, ShieldCheck, Clock4, Loader2 } from "lucide-react";

export default function EnvoyerColis() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmée");
  const [tourType, setTourType] = useState<"public" | "private">("public");
  const [sortBy, setSortBy] = useState<string>("departure_asc");
  
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

  // Tri des tournées
  const sortedTours = [...(tours || [])].sort((a, b) => {
    switch (sortBy) {
      case "departure_asc":
        return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
      case "departure_desc":
        return new Date(b.departure_date).getTime() - new Date(a.departure_date).getTime();
      case "price_asc":
        return (a.carriers?.carrier_capacities?.price_per_kg || 0) - (b.carriers?.carrier_capacities?.price_per_kg || 0);
      case "price_desc":
        return (b.carriers?.carrier_capacities?.price_per_kg || 0) - (a.carriers?.carrier_capacities?.price_per_kg || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SendPackageHero />
      
      {/* Bloc de présentation */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expédiez vos colis en toute simplicité
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trouvez le transporteur idéal pour vos envois entre la France et le Maghreb. 
              Profitez d'un service fiable, sécurisé et au meilleur prix.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Package2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Expédition simplifiée
              </h3>
              <p className="text-gray-600 text-center">
                Réservez votre envoi en quelques clics et suivez votre colis tout au long de son voyage.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Sécurité garantie
              </h3>
              <p className="text-gray-600 text-center">
                Tous nos transporteurs sont vérifiés et certifiés pour assurer la sécurité de vos colis.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Clock4 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Délais optimisés
              </h3>
              <p className="text-gray-600 text-center">
                Bénéficiez de délais de livraison optimisés grâce à notre réseau de transporteurs professionnels.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SendPackageFilters
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          tourType={tourType}
          setTourType={setTourType}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sortedTours?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune tournée disponible
            </h3>
            <p className="text-gray-500">
              Aucune tournée ne correspond à vos critères de recherche pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {sortedTours?.map((tour) => (
              <ClientTourCard
                key={tour.id}
                tour={tour}
                onBookingClick={handleBookingClick}
              />
            ))}
          </div>
        )}
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