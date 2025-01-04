import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TourTimelineCard } from "@/components/transporteur/tour/TourTimelineCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tour, TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CurrentTours() {
  const navigate = useNavigate();
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
        .eq('type', 'public')
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          route: Array.isArray(data.route) ? data.route : JSON.parse(data.route as string),
          status: data.status as TourStatus,
          carriers: {
            ...data.carriers,
            carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
              ? data.carriers.carrier_capacities 
              : [data.carriers?.carrier_capacities]
          }
        } as Tour;
      }
      return null;
    },
  });

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Tournée à ne pas manquer !</h2>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!nextTour) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Tournée à ne pas manquer !</h2>
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
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary mb-2">Tournée à ne pas manquer !</h2>
        <p className="text-gray-600">
          Réservez votre place sur notre prochaine tournée et profitez des meilleurs tarifs
        </p>
      </div>

      <TourTimelineCard 
        tour={nextTour}
        onBookingClick={handleBookingClick}
        hideAvatar={false}
      />

      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate('/envoyer-colis')}
          variant="outline"
          className="gap-2"
        >
          Découvrir toutes nos tournées
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}