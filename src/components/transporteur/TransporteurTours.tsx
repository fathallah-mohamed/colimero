import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";

export interface TransporteurToursProps {
  tours: Tour[];
  type: "public" | "private";
  isLoading: boolean;
}

export function TransporteurTours({ tours, type, isLoading }: TransporteurToursProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  }

  if (tours.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Aucune tournée {type === "public" ? "publique" : "privée"} disponible
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-medium">
                {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium">
                {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
              </span>
            </div>
          </div>

          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            onClick={() => navigate(`/nos-transporteurs/${tour.carrier_id}`)}
          >
            {tour.carriers?.avatar_url ? (
              <img
                src={tour.carriers.avatar_url}
                alt={tour.carriers.company_name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-100" />
            )}
            <span className="text-gray-600 hover:text-blue-600 transition-colors">
              {tour.carriers?.company_name}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Capacité restante : {tour.remaining_capacity} kg</span>
              <span>Total : {tour.total_capacity} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${(tour.remaining_capacity / tour.total_capacity) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
              <span>Ville</span>
              <span>Adresse</span>
              <span>Jour et Heure</span>
              <span className="text-center">Sélection</span>
            </div>
            {tour.route.map((stop, index) => (
              <div key={index} className="grid grid-cols-4 items-center text-sm">
                <span className="font-medium">{stop.name}</span>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{stop.location}</span>
                </div>
                <div className="text-gray-600">
                  <div>
                    {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                  <div>{stop.time}</div>
                </div>
                <div className="flex justify-center">
                  <button className="h-4 w-4 rounded-full border border-gray-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Départ pour la{" "}
            {tour.destination_country === "TN" ? "Tunisie" : "France"} :{" "}
            {format(new Date(tour.departure_date), "d MMMM yyyy", { locale: fr })}
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Sélectionnez un point de collecte
          </Button>
        </div>
      ))}
    </div>
  );
}