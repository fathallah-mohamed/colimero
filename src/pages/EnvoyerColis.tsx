import Navigation from "@/components/Navigation";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { Tour } from "@/types/tour";

export default function EnvoyerColis() {
  const {
    showAuthDialog,
    setShowAuthDialog,
    showAccessDeniedDialog,
    setShowAccessDeniedDialog,
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
      return data as Tour[];
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
          onBookingClick={handleBookingClick}
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