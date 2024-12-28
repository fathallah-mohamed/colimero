import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Package, Shirt, MonitorSmartphone, Sofa, Scale, Home } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";

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
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              {carrier.avatar_url ? (
                <img
                  src={carrier.avatar_url}
                  alt={carrier.company_name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {carrier.first_name?.[0] || carrier.company_name?.[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {carrier.company_name}
              </h1>
              <p className="text-gray-500">{carrier.first_name} {carrier.last_name}</p>
              <p className="text-gray-500">Zone de couverture: {carrier.coverage_area?.join(' - ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations de contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Informations de contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#00B0F0]" />
                <span>{carrier.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#00B0F0]" />
                <span>{carrier.phone}</span>
              </div>
              {carrier.phone_secondary && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#00B0F0]" />
                  <span>{carrier.phone_secondary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Services et Capacités */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Services et Capacités</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Types d'objets acceptés</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#00B0F0]" />
                    <span>Colis standards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-[#00B0F0]" />
                    <span>Vêtements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MonitorSmartphone className="h-5 w-5 text-[#00B0F0]" />
                    <span>Électronique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sofa className="h-5 w-5 text-[#00B0F0]" />
                    <span>Meubles</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Capacité de transport</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[#00B0F0]" />
                    <span>{carrier.carrier_capacities?.[0]?.total_capacity} kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[#00B0F0]" />
                    <span>{carrier.carrier_capacities?.[0]?.price_per_kg}€/kg</span>
                  </div>
                </div>
              </div>

              {carrier.carrier_capacities?.[0]?.offers_home_delivery && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Services additionnels</h3>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-[#00B0F0]" />
                    <span>Collecte & Livraison à Domicile</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Besoin d'en savoir plus ? Contactez ce transporteur dès maintenant !
          </p>
          <ButtonCustom variant="default" className="bg-[#00B0F0] hover:bg-[#0082b3] text-white px-8">
            Contacter le transporteur
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
}