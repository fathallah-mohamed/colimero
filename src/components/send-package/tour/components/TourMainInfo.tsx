import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { Calendar, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface TourMainInfoProps {
  tour: Tour;
}

export function TourMainInfo({ tour }: TourMainInfoProps) {
  const pricePerKg = tour.carriers?.carrier_capacities?.price_per_kg || 0;
  const firstCollectionDate = new Date(tour.collection_date);
  const departureDate = new Date(tour.departure_date);
  const tourDuration = differenceInDays(departureDate, firstCollectionDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex items-center gap-3">
        <TransporteurAvatar 
          avatarUrl={tour.carriers?.avatar_url}
          companyName={tour.carriers?.company_name || ""}
          size="md"
        />
        <span className="text-base font-medium text-gray-900">
          {tour.carriers?.company_name}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
        <Calendar className="h-5 w-5 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm text-blue-600 font-medium">Date de départ</span>
          <span className="text-base font-semibold text-blue-700">
            {format(departureDate, "d MMM yyyy", { locale: fr })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
        <Clock className="h-5 w-5 text-purple-600" />
        <div className="flex flex-col">
          <span className="text-sm text-purple-600 font-medium">Durée de la tournée</span>
          <span className="text-base font-semibold text-purple-700">
            {tourDuration} jours
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="bg-primary/10 px-4 py-2 rounded-full text-base font-medium text-primary text-center">
          {pricePerKg} €/kg
        </span>
        <span className="text-green-600 dark:text-green-400 font-medium text-base text-center px-4 py-2 bg-green-50 rounded-lg">
          {tour.remaining_capacity} kg disponibles
        </span>
      </div>
    </div>
  );
}