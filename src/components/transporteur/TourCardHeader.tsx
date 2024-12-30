import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "./TransporteurAvatar";
import { CalendarDays, MapPin } from "lucide-react";

interface TourCardHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
}

export function TourCardHeader({ tour, hideAvatar }: TourCardHeaderProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">
            {format(new Date(tour.departure_date), "EEEE d MMMM yyyy", { locale: fr })}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-base">
            {tour.departure_country === "FR" ? "France" : "Tunisie"} → {tour.destination_country === "FR" ? "France" : "Tunisie"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-semibold text-primary">
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€
            <span className="text-sm text-gray-600 font-normal">/kg</span>
          </span>
        </div>
      </div>

      {!hideAvatar && (
        <div className="flex items-center gap-3 pt-2 border-t">
          <TransporteurAvatar
            avatarUrl={tour.carriers?.avatar_url}
            name={tour.carriers?.company_name || ""}
            size="md"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {tour.carriers?.company_name}
            </span>
            <span className="text-sm text-gray-500">
              Transporteur vérifié
            </span>
          </div>
        </div>
      )}
    </div>
  );
}