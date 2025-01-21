import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";
import { Tour, RouteStop, TourStatus } from "@/types/tour";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Reserver() {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const pickupCity = searchParams.get('pickupCity');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const currentPath = `/reserver/${tourId}${pickupCity ? `?pickupCity=${pickupCity}` : ''}`;
        sessionStorage.setItem('returnPath', currentPath);
        navigate('/connexion');
      }
    };

    checkAuth();
  }, [tourId, pickupCity, navigate]);

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      if (!tourId) throw new Error("Tour ID is required");
      
      const { data, error } = await supabase
        .from("tours")
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
        .eq("id", parseInt(tourId, 10))
        .single();

      if (error) throw error;

      const transformedTour: Tour = {
        ...data,
        id: parseInt(data.id.toString(), 10),
        route: (data.route as any[]).map((stop): RouteStop => ({
          name: stop.name,
          location: stop.location,
          time: stop.time,
          type: stop.type,
          collection_date: stop.collection_date
        })),
        status: data.status as TourStatus,
        previous_status: data.previous_status as TourStatus | null
      };

      return transformedTour;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <BookingForm 
        tourId={tour.id}
        pickupCity={pickupCity || tour.route[0].name}
        onSuccess={() => {
          toast({
            title: "Réservation créée",
            description: "Votre réservation a été créée avec succès",
          });
          navigate('/mes-reservations');
        }}
      />
    </div>
  );
}