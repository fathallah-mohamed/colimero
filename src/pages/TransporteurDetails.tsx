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

interface CarrierService {
  id: string;
  service_type: string;
}

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
          carrier_services (
            id,
            service_type
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

  const carrierCapacity = transporteur.carrier_capacities?.[0];
  const publicTours = transporteur.tours?.filter((tour) => tour.type === "public") || [];
  const privateTours = transporteur.tours?.filter((tour) => tour.type === "private") || [];

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
              totalCapacity={carrierCapacity?.total_capacity}
              pricePerKg={carrierCapacity?.price_per_kg}
            />

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Services</h2>
              <div className="space-y-4">
                {transporteur.carrier_services?.map((service: CarrierService) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#E5DEFF] flex items-center justify-center">
                      {service.service_type === "express_delivery" ? (
                        <Truck className="h-5 w-5 text-[#00B0F0]" />
                      ) : service.service_type === "home_delivery" ? (
                        <Home className="h-5 w-5 text-[#00B0F0]" />
                      ) : (
                        <Package className="h-5 w-5 text-[#00B0F0]" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900">
                        {service.service_type === "express_delivery"
                          ? "Livraison Express"
                          : service.service_type === "home_delivery"
                          ? "Livraison à domicile"
                          : "Traitement spécial fragile"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Colonne de droite */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Tournées Publiques</h2>
              <div className="space-y-4">
                {publicTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="border rounded-lg p-4 hover:border-[#00B0F0] transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[#00B0F0]" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(tour.departure_date), "d MMMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tour.departure_country} vers {tour.destination_country}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Réserver</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00B0F0]"
                          style={{
                            width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {tour.remaining_capacity}kg / {tour.total_capacity}kg
                      </span>
                    </div>
                  </div>
                ))}
                {publicTours.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aucune tournée publique disponible
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Tournées Privées</h2>
              <div className="space-y-4">
                {privateTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="border rounded-lg p-4 hover:border-[#00B0F0] transition-colors"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[#00B0F0]" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(tour.departure_date), "d MMMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tour.departure_country} vers {tour.destination_country}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Demander un accès</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00B0F0]"
                          style={{
                            width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {tour.remaining_capacity}kg / {tour.total_capacity}kg
                      </span>
                    </div>
                  </div>
                ))}
                {privateTours.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aucune tournée privée disponible
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}