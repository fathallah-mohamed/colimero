import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurLayout } from "@/components/transporteur/TransporteurLayout";
import { TransporteurLeftColumn } from "@/components/transporteur/TransporteurLeftColumn";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { TransporteurNotFound } from "@/components/transporteur/TransporteurNotFound";
import { TourTimelineCard } from "@/components/transporteur/TourTimelineCard";
import type { Tour } from "@/types/tour";

export default function TransporteurDetails() {
  const { id } = useParams();

  const { data: transporteur, isLoading: isLoadingTransporteur } = useQuery({
    queryKey: ["transporteur", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select(`
          *,
          carrier_capacities!carrier_capacities_carrier_id_fkey (
            total_capacity,
            price_per_kg,
            offers_home_delivery
          ),
          carrier_services (
            id,
            service_type,
            description,
            icon
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching carrier:", error);
        throw error;
      }
      return data;
    },
    retry: 1,
    enabled: !!id,
  });

  const { data: publicTours = [], isLoading: isLoadingPublic } = useQuery({
    queryKey: ["transporteur-tours", id, "public"],
    queryFn: async () => {
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
        .eq("carrier_id", id)
        .eq("type", "public")
        .gte("departure_date", new Date().toISOString());

      if (error) {
        console.error("Error fetching public tours:", error);
        throw error;
      }
      
      return data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string)
      })) as Tour[];
    },
    enabled: !!id,
  });

  const { data: privateTours = [], isLoading: isLoadingPrivate } = useQuery({
    queryKey: ["transporteur-tours", id, "private"],
    queryFn: async () => {
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
        .eq("carrier_id", id)
        .eq("type", "private")
        .gte("departure_date", new Date().toISOString());

      if (error) {
        console.error("Error fetching private tours:", error);
        throw error;
      }
      
      return data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string)
      })) as Tour[];
    },
    enabled: !!id,
  });

  if (isLoadingTransporteur) {
    return <TransporteurLoading />;
  }

  if (!transporteur) {
    return <TransporteurNotFound />;
  }

  return (
    <TransporteurLayout>
      <TransporteurHeader
        name={transporteur.company_name || ""}
        coverageArea={transporteur.coverage_area?.join(", ") || ""}
        avatarUrl={transporteur.avatar_url}
        firstName={transporteur.first_name}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransporteurLeftColumn
              email={transporteur.email || ""}
              phone={transporteur.phone || ""}
              phoneSecondary={transporteur.phone_secondary}
              address={transporteur.address || ""}
              capacities={transporteur.carrier_capacities}
              services={transporteur.carrier_services}
              transporteurName={transporteur.company_name || transporteur.first_name}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tournées publiques</h2>
              {isLoadingPublic ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ) : publicTours.length > 0 ? (
                <div className="space-y-4">
                  {publicTours.map((tour) => (
                    <TourTimelineCard
                      key={tour.id}
                      tour={tour}
                      hideAvatar
                      onBookingClick={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucune tournée publique disponible</p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tournées privées</h2>
              {isLoadingPrivate ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ) : privateTours.length > 0 ? (
                <div className="space-y-4">
                  {privateTours.map((tour) => (
                    <TourTimelineCard
                      key={tour.id}
                      tour={tour}
                      hideAvatar
                      onBookingClick={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucune tournée privée disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TransporteurLayout>
  );
}