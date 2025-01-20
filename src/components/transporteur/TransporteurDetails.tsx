import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "./TransporteurHeader";
import { TransporteurServices } from "./TransporteurServices";
import { TransporteurContact } from "./TransporteurContact";
import { ClientTourCard } from "../send-package/tour/ClientTourCard";
import { Loader2 } from "lucide-react";
import { Tour, RouteStop } from "@/types/tour";
import { Json } from "@/integrations/supabase/types";

export function TransporteurDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: carrier, isLoading: isLoadingCarrier } = useQuery({
    queryKey: ['carrier', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select(`
          *,
          carrier_capacities (*),
          carrier_services (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: tours, isLoading: isLoadingTours } = useQuery({
    queryKey: ['carrier-tours', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          carriers (
            *,
            carrier_capacities (*)
          )
        `)
        .eq('carrier_id', id)
        .eq('status', 'Programmée')
        .order('departure_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match the Tour type
      return (data || []).map(tour => {
        const routeData = typeof tour.route === 'string' 
          ? JSON.parse(tour.route) 
          : tour.route;

        const parsedRoute: RouteStop[] = Array.isArray(routeData) 
          ? routeData.map(stop => ({
              name: stop.name,
              location: stop.location,
              time: stop.time,
              type: stop.type,
              collection_date: stop.collection_date
            }))
          : [];

        return {
          ...tour,
          route: parsedRoute,
          status: tour.status as Tour['status'],
          type: tour.type as Tour['type'],
          carriers: tour.carriers ? {
            ...tour.carriers,
            carrier_capacities: Array.isArray(tour.carriers.carrier_capacities)
              ? tour.carriers.carrier_capacities[0]
              : tour.carriers.carrier_capacities
          } : undefined
        } as Tour;
      });
    }
  });

  if (isLoadingCarrier || isLoadingTours) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!carrier) {
    return <div>Transporteur non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TransporteurHeader 
        name={carrier.company_name}
        coverageArea={carrier.coverage_area}
        avatarUrl={carrier.avatar_url}
      />
      
      <div className="mt-8 grid gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Tournées programmées</h2>
          <div className="space-y-4">
            {tours && tours.length > 0 ? (
              tours.map((tour) => (
                <ClientTourCard key={tour.id} tour={tour} />
              ))
            ) : (
              <p className="text-gray-500">Aucune tournée programmée pour le moment</p>
            )}
          </div>
        </section>

        <TransporteurServices services={carrier.carrier_services} />
        <TransporteurContact 
          email={carrier.email}
          phone={carrier.phone}
          phoneSecondary={carrier.phone_secondary}
          address={carrier.address}
        />
      </div>
    </div>
  );
}