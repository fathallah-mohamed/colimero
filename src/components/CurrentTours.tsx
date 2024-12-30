import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CurrentTours() {
  const { data: tours, isLoading } = useQuery({
    queryKey: ["current-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          carriers (
            company_name,
            avatar_url,
            carrier_capacities (
              price_per_kg
            )
          )
        `)
        .eq("type", "public")
        .gte("departure_date", new Date().toISOString())
        .order("departure_date", { ascending: true })
        .limit(2);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Un aperçu de nos tournées actuelles
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {isLoading ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              Chargement des tournées...
            </div>
          ) : tours && tours.length > 0 ? (
            tours.map((tour) => (
              <div key={tour.id} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">
                  {tour.departure_country === "FR" ? "France" : "Tunisie"} vers{" "}
                  {tour.destination_country === "TN" ? "Tunisie" : "France"}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-blue-600 font-medium">
                        {format(new Date(tour.departure_date), "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                      <p className="text-sm text-gray-600">
                        {tour.carriers?.company_name || "Transport Express"}
                      </p>
                    </div>
                    <span className="text-gray-600">
                      {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {tour.remaining_capacity} / {tour.total_capacity}kg
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              Aucune tournée disponible pour le moment
            </div>
          )}
        </div>
        <div className="text-center">
          <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/tournees">Voir toutes les tournées</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}