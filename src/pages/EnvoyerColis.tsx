import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import AuthDialog from "@/components/auth/AuthDialog";
import { Tour } from "@/types/tour";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { Package2, Truck, Clock, Shield } from "lucide-react";

export default function EnvoyerColis() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>("FR_TO_TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmé");

  const {
    showAuthDialog,
    setShowAuthDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['public-tours', selectedRoute, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('tours')
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
        .eq('type', 'public');

      if (selectedRoute === "FR_TO_TN") {
        query = query.eq('departure_country', 'FR').eq('destination_country', 'TN');
      } else if (selectedRoute === "TN_TO_FR") {
        query = query.eq('departure_country', 'TN').eq('destination_country', 'FR');
      }

      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query.order('departure_date', { ascending: true });

      if (error) throw error;

      return data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) 
          ? tour.route 
          : [],
        carriers: tour.carriers ? {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
            ? tour.carriers.carrier_capacities
            : [tour.carriers.carrier_capacities]
        } : undefined
      })) as Tour[];
    },
  });

  const handleTourClick = (tourId: number, pickupCity: string) => {
    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0FA0CE] to-[#0C82A7] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Envoyez vos colis en toute simplicité
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Trouvez le transporteur idéal pour acheminer vos colis entre la France et la Tunisie
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Package2 className="h-6 w-6 text-[#0FA0CE]" />
              </div>
              <h3 className="font-semibold mb-2">Expédition Facile</h3>
              <p className="text-gray-600 text-sm">Réservez en quelques clics</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Truck className="h-6 w-6 text-[#0FA0CE]" />
              </div>
              <h3 className="font-semibold mb-2">Transporteurs Vérifiés</h3>
              <p className="text-gray-600 text-sm">Des professionnels de confiance</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-[#0FA0CE]" />
              </div>
              <h3 className="font-semibold mb-2">Suivi en Temps Réel</h3>
              <p className="text-gray-600 text-sm">Suivez votre colis à chaque étape</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-[#0FA0CE]" />
              </div>
              <h3 className="font-semibold mb-2">Sécurité Garantie</h3>
              <p className="text-gray-600 text-sm">Vos colis sont entre de bonnes mains</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Tournées disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Trajet
              </label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un trajet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR_TO_TN">France → Tunisie</SelectItem>
                  <SelectItem value="TN_TO_FR">Tunisie → France</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Statut
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Programmé">Programmé</SelectItem>
                  <SelectItem value="Ramassage en cours">Ramassage en cours</SelectItem>
                  <SelectItem value="En transit">En transit</SelectItem>
                  <SelectItem value="Livraison en cours">Livraison en cours</SelectItem>
                  <SelectItem value="Livraison terminée">Livraison terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TransporteurTours
          tours={tours || []}
          type="public"
          isLoading={isLoading}
          userType={null}
          handleBookingClick={handleTourClick}
          TimelineComponent={ClientTimeline}
        />
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