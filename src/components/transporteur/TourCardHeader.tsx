import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "./TransporteurAvatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Truck, CreditCard } from "lucide-react";

interface TourCardHeaderProps {
  tour: Tour;
  hideAvatar?: boolean;
  type?: "public" | "private";
  userType?: string;
}

export function TourCardHeader({ tour, hideAvatar, type, userType }: TourCardHeaderProps) {
  const firstCity = tour.route[0]?.name;
  const lastCity = tour.route[tour.route.length - 1]?.name;
  const pricePerKg = tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!hideAvatar && (
          <TransporteurAvatar
            avatarUrl={tour.carriers?.avatar_url}
            companyName={tour.carriers?.company_name || ""}
            size="md"
          />
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {tour.carriers?.company_name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm truncate">
            {firstCity} → {lastCity}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm">
            {format(new Date(tour.departure_date), "d MMM yyyy", { locale: fr })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Truck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm">
            {tour.remaining_capacity} kg disponibles
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <CreditCard className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium">
            {pricePerKg}€/kg
          </span>
        </div>
      </div>
    </div>
  );
}