import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurContact } from "@/components/transporteur/TransporteurContact";
import { TransporteurCapacities } from "@/components/transporteur/TransporteurCapacities";
import { TransporteurServices } from "@/components/transporteur/TransporteurServices";
import { TransporteurTours } from "@/components/transporteur/TransporteurTours";

export default function TransporteurDetails() {
  const { id } = useParams();

  const { data: transporteur, isLoading } = useQuery({
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
          carrier_services!carrier_services_carrier_id_fkey (
            id,
            service_type,
            description,
            icon
          ),
          tours (
            id,
            type,
            departure_date,
            departure_country,
            destination_country,
            remaining_capacity,
            total_capacity
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!transporteur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Transporteur non trouvé</p>
        </div>
      </div>
    );
  }

  const publicTours = transporteur.tours?.filter(tour => tour.type === 'public') || [];
  const privateTours = transporteur.tours?.filter(tour => tour.type === 'private') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <TransporteurHeader
        name={transporteur.company_name || ""}
        coverageArea={transporteur.coverage_area?.join(", ") || ""}
        avatarUrl={transporteur.avatar_url}
        firstName={transporteur.first_name}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche */}
          <div className="space-y-6">
            <TransporteurContact
              email={transporteur.email || ""}
              phone={transporteur.phone || ""}
              phoneSecondary={transporteur.phone_secondary}
              address={transporteur.address || ""}
            />

            <TransporteurCapacities
              capacities={transporteur.carrier_capacities}
            />

            <TransporteurServices services={transporteur.carrier_services || []} />
          </div>

          {/* Colonne de droite */}
          <div className="md:col-span-2 space-y-6">
            <TransporteurTours tours={publicTours} type="public" />
            <TransporteurTours tours={privateTours} type="private" />
          </div>
        </div>
      </div>
    </div>
  );
}