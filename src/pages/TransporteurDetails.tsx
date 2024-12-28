import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurContact } from "@/components/transporteur/TransporteurContact";
import { TransporteurCapacities } from "@/components/transporteur/TransporteurCapacities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Truck, Home, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
          tours (
            id,
            type,
            departure_date,
            collection_date,
            remaining_capacity,
            total_capacity,
            departure_country,
            destination_country
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
          </div>
        </div>
      </div>
    </div>
  );
}