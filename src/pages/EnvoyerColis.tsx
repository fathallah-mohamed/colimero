import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { Tour, RouteStop } from "@/types/tour";
import { SendPackageHero } from "@/components/send-package/SendPackageHero";
import { SendPackageFeatures } from "@/components/send-package/SendPackageFeatures";
import { SendPackageFilters } from "@/components/send-package/SendPackageFilters";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const { data: tours, isLoading } = useQuery({
    queryKey: ['public-tours', selectedRoute, selectedStatus, tourType],
    queryFn: async () => {
      try {
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
          .eq('type', tourType);

        // Set departure and destination countries based on selected route
        if (selectedRoute === "FR_TO_TN") {
          query = query.eq('departure_country', 'FR').eq('destination_country', 'TN');
        } else if (selectedRoute === "TN_TO_FR") {
          query = query.eq('departure_country', 'TN').eq('destination_country', 'FR');
        }

        // Only apply status filter if not "all"
        if (selectedStatus !== "all") {
          query = query.eq('status', selectedStatus);
        }

        const { data, error } = await query.order('departure_date', { ascending: true });

        if (error) {
          console.error('Error fetching tours:', error);
          throw error;
        }

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
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  const handleTourClick = (tourId: number, pickupCity: string) => {
    navigate(`/reserver/${tourId}?pickupCity=${encodeURIComponent(pickupCity)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SendPackageHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <SendPackageFeatures />
          
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Choisissez entre deux types de tournées pour votre envoi :
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
              <div className="p-3 bg-muted rounded-lg">
                <strong className="text-primary">Tournées Publiques :</strong>
                <p>Partagez l'espace avec d'autres colis pour un prix plus avantageux.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <strong className="text-primary">Tournées Privées :</strong>
                <p>Réservez tout l'espace pour vos colis, idéal pour les envois volumineux.</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="public" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="public"
                onClick={() => setTourType("public")}
              >
                Tournées Publiques
              </TabsTrigger>
              <TabsTrigger 
                value="private"
                onClick={() => setTourType("private")}
              >
                Tournées Privées
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <SendPackageFilters
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>

        <TransporteurTours
          tours={tours || []}
          type={tourType}
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