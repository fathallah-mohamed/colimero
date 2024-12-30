import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TourCapacityDisplay } from "./TourCapacityDisplay";
import { TourCardHeader } from "./TourCardHeader";
import { TourCollectionPoints } from "./TourCollectionPoints";
import { TourTimeline } from "./TourTimeline";

interface TourCardProps {
  tour: Tour;
  selectedPoint: string | undefined;
  onPointSelect: (cityName: string) => void;
  onReservation: () => void;
  hideAvatar?: boolean;
}

export function TourCard({ tour, selectedPoint, onPointSelect, onReservation, hideAvatar }: TourCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <TourCardHeader tour={tour} hideAvatar={hideAvatar} />

      <TourTimeline status={tour.status} />

      <TourCapacityDisplay 
        remainingCapacity={tour.remaining_capacity} 
        totalCapacity={tour.total_capacity}
      />

      <TourCollectionPoints
        route={tour.route}
        selectedPoint={selectedPoint}
        onPointSelect={onPointSelect}
      />

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