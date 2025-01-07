import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import AuthDialog from "@/components/auth/AuthDialog";
import { Tour } from "@/types/tour";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";

export default function EnvoyerColis() {
  const [selectedDeparture, setSelectedDeparture] = useState<string>("FR");
  const [selectedDestination, setSelectedDestination] = useState<string>("TN");
  const [selectedStatus, setSelectedStatus] = useState<string>("Programmé");

  const {
    showAuthDialog,
    setShowAuthDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['public-tours', selectedDeparture, selectedDestination, selectedStatus],
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
        .eq('type', 'public')
        .eq('departure_country', selectedDeparture)
        .eq('destination_country', selectedDestination);

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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Pays de départ
                </label>
                <Select value={selectedDeparture} onValueChange={setSelectedDeparture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays de départ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="TN">Tunisie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pb-2">
                <ArrowLeftRight className="h-6 w-6 text-gray-400" />
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Pays d'arrivée
                </label>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays d'arrivée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TN">Tunisie</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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