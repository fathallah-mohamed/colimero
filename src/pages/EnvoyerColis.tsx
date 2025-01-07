import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { useBookingFlow } from "@/hooks/useBookingFlow";
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
          ? tour.route.map((stop: any): RouteStop => ({
              name: stop.name,
              location: stop.location,
              time: stop.time,
              type: stop.type || "pickup",
              collection_date: stop.collection_date || tour.collection_date
            }))
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
      
      <div className="bg-gradient-to-br from-[#0FA0CE] to-[#0C82A7] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Envoyez vos colis
            </h1>
            <p className="text-gray-100">
              Trouvez le transporteur idéal pour votre envoi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Features Row */}
            <div className="col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 border-b pb-4">
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-full">
                    <Package2 className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <div>
                    <span className="font-medium">Expédition Facile</span>
                    <p className="text-sm text-gray-600 mt-1">Processus simplifié de bout en bout</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-full">
                    <Truck className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <div>
                    <span className="font-medium">Transporteurs Vérifiés</span>
                    <p className="text-sm text-gray-600 mt-1">Partenaires de confiance</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <div>
                    <span className="font-medium">Suivi en Temps Réel</span>
                    <p className="text-sm text-gray-600 mt-1">Localisez vos colis</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-full">
                    <Shield className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <div>
                    <span className="font-medium">Sécurité Garantie</span>
                    <p className="text-sm text-gray-600 mt-1">Protection maximale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Trajet
              </label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
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
                <SelectTrigger>
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