import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Package, Truck, Home, Shirt, Sofa, MonitorSmartphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
      <Navigation />
      
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/transporteurs" className="inline-flex items-center text-white mb-8 hover:opacity-80">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux transporteurs
          </Link>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
              {carrier.avatar_url ? (
                <img
                  src={carrier.avatar_url}
                  alt={carrier.company_name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {carrier.company_name?.[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {carrier.company_name}
              </h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{carrier.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>{carrier.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{carrier.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                  <Phone className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-gray-900">{carrier.phone}</p>
                </div>
              </div>
              {carrier.phone_secondary && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone secondaire</p>
                    <p className="text-gray-900">{carrier.phone_secondary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services et capacités */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Services et capacités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Types d'objets acceptés</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Package className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">Colis standards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Shirt className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">Vêtements</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <MonitorSmartphone className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">Électronique</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Sofa className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">Meubles</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Capacité de transport</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Truck className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">
                        {carrier.carrier_capacities?.total_capacity} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                        <Truck className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                      <span className="text-sm">
                        {carrier.carrier_capacities?.price_per_kg}€/kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {carrier.carrier_capacities?.offers_home_delivery && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Services additionnels</h2>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-[#E5DEFF] flex items-center justify-center">
                    <Home className="h-4 w-4 text-[#8B5CF6]" />
                  </div>
                  <span className="text-sm">Collecte & Livraison à Domicile</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600 text-center">
            Besoin d'en savoir plus ? Contactez ce transporteur dès maintenant !
          </p>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="bg-white border-[#9b87f5] text-[#9b87f5] hover:bg-[#E5DEFF] hover:text-[#9b87f5] hover:border-[#9b87f5]"
            >
              Voir les tournées
            </Button>
            <Button 
              className="bg-[#9b87f5] text-white hover:bg-[#8B5CF6]"
            >
              Contacter le transporteur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}