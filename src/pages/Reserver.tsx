import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/booking/BookingForm";
import Navigation from "@/components/Navigation";
import { Tour } from "@/types/tour";

export default function Reserver() {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const pickupCity = searchParams.get("pickupCity");

  const { data: tour, isLoading } = useQuery({
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
        .single();

      if (error) throw error;
      return data as Tour;
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

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Tournée non trouvée</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)]">
        <BookingForm
          tourId={parseInt(tourId!)}
          pickupCity={pickupCity}
          destinationCountry={tour.destination_country}
          onSuccess={() => window.location.href = "/mes-reservations"}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
}