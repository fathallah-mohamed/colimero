import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ButtonCustom } from "@/components/ui/button-custom";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, Home, Shirt, Sofa, MonitorSmartphone } from "lucide-react";
import { TransporteurHeader } from "@/components/transporteur/TransporteurHeader";
import { TransporteurContact } from "@/components/transporteur/TransporteurContact";

export default function TransporteurDetails() {
  const { id } = useParams();

  const { data: carrier, isLoading } = useQuery({
    queryKey: ["carrier", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carriers")
        .select(`
          *,
          carrier_capacities (
            total_capacity,
            price_per_kg,
            offers_home_delivery
          ),
          carrier_services (
            service_type
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!carrier) {
    return <div>Transporteur non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TransporteurHeader 
        name={carrier.company_name || ''}
        firstName={carrier.first_name}
        coverageArea={carrier.coverage_area?.join(' - ') || ''}
        avatarUrl={carrier.avatar_url}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TransporteurContact 
            email={carrier.email || ''}
            phone={carrier.phone || ''}
            phoneSecondary={carrier.phone_secondary}
          />

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Services et capacités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Types d'objets acceptés</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Package, label: "Colis standards" },
                      { icon: Shirt, label: "Vêtements" },
                      { icon: MonitorSmartphone, label: "Électronique" },
                      { icon: Sofa, label: "Meubles" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-[#00B0F0]" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Capacité de transport</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Truck className="h-4 w-4 text-[#00B0F0]" />
                      </div>
                      <span className="text-sm">
                        {carrier.carrier_capacities?.[0]?.total_capacity} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Truck className="h-4 w-4 text-[#00B0F0]" />
                      </div>
                      <span className="text-sm">
                        {carrier.carrier_capacities?.[0]?.price_per_kg}€/kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {carrier.carrier_capacities?.[0]?.offers_home_delivery && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Services additionnels</h2>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                    <Home className="h-4 w-4 text-[#00B0F0]" />
                  </div>
                  <span className="text-sm">Collecte & Livraison à Domicile</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600 text-center">
            Besoin d'en savoir plus ? Contactez ce transporteur dès maintenant !
          </p>
          <div className="flex gap-4">
            <ButtonCustom variant="outline">
              Voir les tournées
            </ButtonCustom>
            <ButtonCustom variant="default">
              Contacter le transporteur
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
}