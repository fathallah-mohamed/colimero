import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { Tour } from "@/types/tour";
import AuthDialog from "@/components/auth/AuthDialog";

export default function EnvoyerColis() {
  const {
    showAuthDialog,
    setShowAuthDialog,
    handleBookingClick,
    handleAuthSuccess
  } = useBookingFlow();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['public-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq('status', 'Programmé')
        .order('departure_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match the Tour type
      const transformedTours = data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) 
          ? tour.route.map(stop => ({
              name: stop.name,
              location: stop.location,
              time: stop.time,
              type: stop.type,
              collection_date: stop.collection_date
            }))
          : typeof tour.route === 'string'
            ? JSON.parse(tour.route).map((stop: any) => ({
                name: stop.name,
                location: stop.location,
                time: stop.time,
                type: stop.type,
                collection_date: stop.collection_date
              }))
            : tour.route,
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