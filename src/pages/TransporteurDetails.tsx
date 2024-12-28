import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Package, Truck, Home } from "lucide-react";

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {carrier.first_name?.[0] || "H"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{carrier.company_name}</h1>
              <p className="text-gray-600">{carrier.first_name} {carrier.last_name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>Zone de couverture: {carrier.coverage_area?.join(" - ")}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Informations de contact</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{carrier.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span>{carrier.phone}</span>
              </div>
              {carrier.phone_secondary && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{carrier.phone_secondary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Services and Capacities */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Services et Capacités</h2>
            
            {/* Types d'objets acceptés */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Types d'objets acceptés</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span>Colis standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span>Vêtements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span>Électronique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span>Meubles</span>
                </div>
              </div>
            </div>

            {/* Capacité de transport */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Capacité de transport</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span>{carrier.carrier_capacities?.total_capacity} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span>{carrier.carrier_capacities?.price_per_kg}€/kg</span>
                </div>
              </div>
            </div>

            {/* Services additionnels */}
            {carrier.carrier_capacities?.offers_home_delivery && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Services additionnels</h3>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-400" />
                  <span>Collecte & Livraison à Domicile</span>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Besoin d'en savoir plus ? Contactez ce transporteur dès maintenant !
            </p>
            <Button className="w-full sm:w-auto">
              Contacter le transporteur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}