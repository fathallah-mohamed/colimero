import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "./TransporteurAvatar";
import { CalendarDays, MapPin, TruckIcon, EuroIcon } from "lucide-react";

interface TourCardHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
}

export function TourCardHeader({ tour, hideAvatar }: TourCardHeaderProps) {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {/* Date de départ */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <CalendarDays className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Date de départ</span>
          <span className="text-lg font-medium text-gray-900">
            {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>
      </div>

      {/* Trajet */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Trajet</span>
          <span className="text-lg font-medium text-gray-900">
            {tour.departure_country === "FR" ? "France" : "Tunisie"} → {tour.destination_country === "FR" ? "France" : "Tunisie"}
          </span>
        </div>
      </div>

      {/* Prix */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <EuroIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Prix par kilogramme</span>
          <span className="text-lg font-medium text-gray-900">
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€<span className="text-sm text-gray-500">/kg</span>
          </span>
        </div>
      </div>

      {/* Transporteur */}
      {!hideAvatar && (
        <div className="flex items-center gap-3 pt-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <TruckIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-3 flex-1">
            <TransporteurAvatar
              avatarUrl={tour.carriers?.avatar_url}
              name={tour.carriers?.company_name || ""}
              size="md"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {tour.carriers?.company_name}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-primary">
                  Transporteur vérifié
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}