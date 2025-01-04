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
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Informations principales */}
      <div className="flex flex-wrap items-center gap-4 p-4 border-b border-gray-100">
        {!hideAvatar && (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="p-2 bg-primary/10 rounded-full">
              <TruckIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <TransporteurAvatar
                avatarUrl={tour.carriers?.avatar_url}
                companyName={tour.carriers?.company_name || ""}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {tour.carriers?.company_name}
                </span>
                <span className="text-xs text-primary">Vérifié</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="p-2 bg-primary/10 rounded-full">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Trajet</span>
            <span className="text-sm font-medium text-gray-900">
              {tour.departure_country === "FR" ? "France" : "Tunisie"} → {tour.destination_country === "FR" ? "France" : "Tunisie"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-[120px]">
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

      {/* Date de départ */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Date de départ</span>
            <span className="text-sm font-medium text-gray-900">
              {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}