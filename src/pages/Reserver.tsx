import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";
import Navigation from "@/components/Navigation";
import { Tour, RouteStop } from "@/types/tour";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Reserver() {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const pickupCity = searchParams.get("pickupCity");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier le type d'utilisateur
  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/connexion');
        return;
      }

      // Vérifier si l'utilisateur est un admin
      const { data: adminData } = await supabase
        .from('administrators')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (adminData) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Les administrateurs ne peuvent pas effectuer de réservations",
        });
        navigate('/profil');
        return;
      }

      // Vérifier si l'utilisateur est un transporteur
      const userType = user.user_metadata?.user_type;
      if (userType === 'carrier') {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Les transporteurs ne peuvent pas effectuer de réservations",
        });
        navigate('/mes-tournees');
        return;
      }
    };

    checkUserType();
  }, [navigate]);

  const { data: tour, isLoading, error } = useQuery({
    queryKey: ["tour", tourId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
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
        .eq("id", tourId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return null;
      }

      // Transform the route data from JSON to RouteStop[]
      const parsedRoute = Array.isArray(data.route) 
        ? data.route 
        : JSON.parse(data.route as string);

      const transformedRoute = parsedRoute.map((stop: any): RouteStop => ({
        name: stop.name,
        location: stop.location,
        time: stop.time,
        type: stop.type,
        collection_date: stop.collection_date
      }));

      return {
        ...data,
        route: transformedRoute,
        carriers: {
          ...data.carriers,
          carrier_capacities: Array.isArray(data.carriers?.carrier_capacities) 
            ? data.carriers.carrier_capacities 
            : [data.carriers?.carrier_capacities]
        }
      } as Tour;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            Cette tournée n'existe pas ou n'est plus disponible
          </div>
        </div>
      </div>
    );
  }

  if (!pickupCity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            Veuillez sélectionner une ville de collecte
          </div>
        </div>
      </div>
    );
  }

  // Convert tourId from string to number before passing it to BookingForm
  const numericTourId = tourId ? parseInt(tourId) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)]">
        <BookingForm
          tourId={numericTourId}
          pickupCity={pickupCity}
          destinationCountry={tour.destination_country}
          onSuccess={() => window.location.href = "/mes-reservations"}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
}