import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourCard } from "@/components/transporteur/TourCard";
import { Tour } from "@/types/tour";

export default function EnvoyerColis() {
  const [tours, setTours] = useState<Tour[]>([]);
  const { toast } = useToast();

  const fetchTours = async () => {
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
      .eq('status', 'planned')
      .gte('departure_date', new Date().toISOString());

    if (error) throw error;

    const transformedTours = data?.map(tour => ({
      ...tour,
      route: Array.isArray(tour.route)
        ? tour.route
        : JSON.parse(tour.route as string),
      carriers: tour.carriers ? {
        ...tour.carriers,
        carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
          ? tour.carriers.carrier_capacities
          : [tour.carriers.carrier_capacities]
      } : undefined
    })) as Tour[];

    setTours(transformedTours || []);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Tournées disponibles</h1>
      <div className="space-y-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}