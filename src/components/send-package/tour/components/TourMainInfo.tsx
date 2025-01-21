import { Tour } from "@/types/tour";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { Calendar, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TourMainInfoProps {
  tour: Tour;
  isExpanded: boolean;
  onExpandClick: () => void;
}

export function TourMainInfo({ tour, isExpanded, onExpandClick }: TourMainInfoProps) {
  const pricePerKg = tour.carriers?.carrier_capacities?.price_per_kg || 0;
  const firstCollectionDate = new Date(tour.collection_date);
  const departureDate = new Date(tour.departure_date);
  const tourDuration = differenceInDays(departureDate, firstCollectionDate);
  
  const usedCapacity = tour.total_capacity - tour.remaining_capacity;
  const capacityPercentage = (usedCapacity / tour.total_capacity) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <div className="space-y-4">
        <span className="bg-primary/10 px-4 py-2 rounded-full text-base font-medium text-primary text-center block w-fit">
          {pricePerKg} €/kg
        </span>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Capacité disponible :</span>
            <span>{tour.remaining_capacity} kg sur {tour.total_capacity} kg</span>
          </div>
          <Progress value={capacityPercentage} className="h-3 w-full" />
          <div className="text-sm text-gray-600 text-right">
            {Math.round(capacityPercentage)}% utilisé
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-[#0FA0CE] hover:text-[#0FA0CE] hover:bg-[#0FA0CE]/10"
          onClick={onExpandClick}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isExpanded ? "Masquer les détails" : "Afficher les détails"}
        </Button>
      </div>
    </div>
  );
}