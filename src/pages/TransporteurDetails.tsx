import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurLayout } from "@/components/transporteur/TransporteurLayout";
import { TransporteurLeftColumn } from "@/components/transporteur/TransporteurLeftColumn";
import { TransporteurLoading } from "@/components/transporteur/TransporteurLoading";
import { TransporteurNotFound } from "@/components/transporteur/TransporteurNotFound";
import { TourTimelineCard } from "@/components/transporteur/TourTimelineCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const { data: tours = [], isLoading: isLoadingTours } = useQuery({
    queryKey: ["carrier-tours", id],
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
        .gte("departure_date", new Date().toISOString());

      if (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }

      return data?.map(tour => ({
        ...tour,
        route: Array.isArray(tour.route) ? tour.route : JSON.parse(tour.route as string)
      })) as Tour[];
    },
    retry: 1,
    enabled: !!id,
  });

  if (isLoadingTransporteur) {
    return <TransporteurLoading />;
  }

  if (!transporteur) {
    return <TransporteurNotFound />;
  }

  const plannedTours = tours.filter(tour => tour.status === "Programmée");
  const otherTours = tours.filter(tour => tour.status !== "Programmée");

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
          <div className="lg:col-span-2">
            <Tabs defaultValue="planned" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="planned">Tournées programmées</TabsTrigger>
                <TabsTrigger value="others">Autres tournées</TabsTrigger>
              </TabsList>

              <TabsContent value="planned" className="space-y-6">
                {isLoadingTours ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                    ))}
                  </div>
                ) : plannedTours.length > 0 ? (
                  <div className="space-y-4">
                    {plannedTours.map((tour) => (
                      <TourTimelineCard
                        key={tour.id}
                        tour={tour}
                        hideAvatar
                        onBookingClick={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune tournée programmée disponible</p>
                )}
              </TabsContent>

              <TabsContent value="others" className="space-y-6">
                {isLoadingTours ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                    ))}
                  </div>
                ) : otherTours.length > 0 ? (
                  <div className="space-y-4">
                    {otherTours.map((tour) => (
                      <TourTimelineCard
                        key={tour.id}
                        tour={tour}
                        hideAvatar
                        onBookingClick={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune autre tournée disponible</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TransporteurLayout>
  );
}