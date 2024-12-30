import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "./TransporteurAvatar";
import { TruckIcon, MapPin, EuroIcon } from "lucide-react";

interface TourCardHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
}

export function TourCardHeader({ tour, hideAvatar }: TourCardHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Ligne principale avec transporteur, trajet et prix */}
      <div className="flex items-center gap-6 overflow-x-auto mb-4">
        {/* Transporteur */}
        {!hideAvatar && (
          <div className="flex items-center gap-3 min-w-fit">
            <div className="p-2 bg-primary/10 rounded-full">
              <TruckIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <TransporteurAvatar
                avatarUrl={tour.carriers?.avatar_url}
                name={tour.carriers?.company_name || ""}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {tour.carriers?.company_name}
                </span>
                <span className="text-xs text-primary">
                  Vérifié
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Séparateur vertical */}
        {!hideAvatar && <div className="h-10 w-px bg-gray-200" />}

        {/* Trajet */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="p-2 bg-primary/10 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Trajet</span>
            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
              {tour.departure_country === "FR" ? "France" : "Tunisie"} → {tour.destination_country === "FR" ? "France" : "Tunisie"}
            </span>
          </div>
        </div>

        {/* Séparateur vertical */}
        <div className="h-10 w-px bg-gray-200" />

        {/* Prix */}
        <div className="flex items-center gap-3 min-w-fit">
          <div className="p-2 bg-primary/10 rounded-full">
            <EuroIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Prix</span>
            <span className="text-sm font-medium text-gray-900">
              {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€<span className="text-gray-500">/kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Date de départ en dessous */}
      <div className="text-center text-sm text-gray-500">
        Départ le {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
      </div>
    </div>
  );
}