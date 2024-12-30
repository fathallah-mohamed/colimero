import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "./TransporteurAvatar";

interface TourCardHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
}

export function TourCardHeader({ tour, hideAvatar }: TourCardHeaderProps) {
  return (
    <>
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

      {!hideAvatar && (
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
      )}
    </>
  );
}