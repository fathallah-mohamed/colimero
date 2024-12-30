import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TransporteurAvatar } from "./TransporteurAvatar";
import { TourCapacityDisplay } from "./TourCapacityDisplay";

interface TourCardProps {
  tour: Tour;
  selectedPoint: string | undefined;
  onPointSelect: (cityName: string) => void;
  onReservation: () => void;
}

export function TourCard({ tour, selectedPoint, onPointSelect, onReservation }: TourCardProps) {
  const getGoogleMapsUrl = (location: string, city: string) => {
    const query = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium">
            {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-medium">
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€/kg
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <TransporteurAvatar
          avatarUrl={tour.carriers?.avatar_url}
          name={tour.carriers?.company_name || ""}
          size="md"
        />
        <span className="text-gray-600">
          {tour.carriers?.company_name}
        </span>
      </div>

      <TourCapacityDisplay 
        remainingCapacity={tour.remaining_capacity} 
        totalCapacity={tour.total_capacity}
      />

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
              <a 
                href={getGoogleMapsUrl(stop.location, stop.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                {stop.location}
              </a>
            </div>
            <div className="text-gray-600">
              <div>
                {format(new Date(stop.collection_date), "EEEE d MMMM yyyy", {
                  locale: fr,
                })}
              </div>
              <div>{stop.time}</div>
            </div>
            <div className="flex justify-center">
              <input
                type="radio"
                name={`tour-${tour.id}`}
                className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                onChange={() => onPointSelect(stop.name)}
                checked={selectedPoint === stop.name}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        Départ pour la {tour.destination_country === "TN" ? "Tunisie" : "France"} le{" "}
        {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
      </div>

      <Button 
        className="w-full bg-blue-500 hover:bg-blue-600"
        onClick={onReservation}
        disabled={!selectedPoint}
      >
        {selectedPoint ? "Réserver" : "Sélectionnez un point de collecte"}
      </Button>
    </div>
  );
}