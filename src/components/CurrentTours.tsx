import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TourTimelineCard } from "@/components/transporteur/tour/TourTimelineCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tour, TourStatus } from "@/types/tour";

export default function CurrentTours() {
  const { data: nextTour, isLoading } = useQuery({
    queryKey: ['next-planned-tour'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          carriers (
            company_name,
            first_name,
            last_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq('status', 'planned')
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      
      // Parse the route if it's a string and ensure proper typing
      if (data) {
        return {
          ...data,
          route: Array.isArray(data.route) ? data.route : JSON.parse(data.route as string),
          status: data.status as TourStatus, // Explicitly type the status
          carriers: {
            ...data.carriers,
            carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
              ? data.carriers.carrier_capacities 
              : [data.carriers?.carrier_capacities]
          }
        } as Tour; // Assert the entire object as Tour type
      }
      return null;
    },
  });

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!nextTour) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Aucune tournée planifiée pour le moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBookingClick = (tourId: number, pickupCity: string) => {
    window.location.href = `/reserver/${tourId}`;
  };

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Prochaine tournée planifiée</h2>
      <TourTimelineCard 
        tour={nextTour}
        onBookingClick={handleBookingClick}
        hideAvatar={false}
      />
    </div>
  );
}