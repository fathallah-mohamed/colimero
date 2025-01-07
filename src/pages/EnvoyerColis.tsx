import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import AuthDialog from "@/components/auth/AuthDialog";
import { Tour } from "@/types/tour";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EnvoyerColis() {
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

      // Appliquer le filtre de trajet
      if (selectedRoute === "FR_TO_TN") {
        query = query.eq('departure_country', 'FR').eq('destination_country', 'TN');
      } else if (selectedRoute === "TN_TO_FR") {
        query = query.eq('departure_country', 'TN').eq('destination_country', 'FR');
      }

      // Appliquer le filtre de statut
      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query.order('departure_date', { ascending: true });

      if (error) throw error;

      const transformedTours = data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) 
          ? tour.route.map((stop: any) => ({
              name: stop.name || '',
              location: stop.location || '',
              time: stop.time || '',
              type: stop.type || 'pickup',
              collection_date: stop.collection_date || ''
            }))
          : [],
        carriers: tour.carriers ? {
          ...tour.carriers,
          carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
            ? tour.carriers.carrier_capacities
            : [tour.carriers.carrier_capacities]
        } : undefined
      })) as Tour[];

      return transformedTours || [];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Tournées disponibles</h1>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          handleBookingClick={handleBookingClick}
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