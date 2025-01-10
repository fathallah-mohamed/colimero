import { Tour } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPoint: string;
  onPointSelect: (point: string) => void;
  onBookingClick: () => void;
  isBookingEnabled: boolean;
}

export function TourExpandedContent({ 
  tour, 
  selectedPoint, 
  onPointSelect,
  onBookingClick,
  isBookingEnabled
}: TourExpandedContentProps) {
  const pickupPoints = tour.route?.filter(stop => 
    stop.type === 'pickup' || stop.type === 'ramassage'
  ) || [];

  const getBookingButtonText = () => {
    if (tour.status === "Annulée") return "Cette tournée a été annulée";
    if (tour.status !== "Programmée") return "Cette tournée n'est plus disponible pour les réservations";
    if (!selectedPoint) return "Sélectionnez un point de ramassage pour réserver";
    return "Réserver maintenant";
  };

  return (
    <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 duration-200">
      <ClientTimeline 
        status={tour.status} 
        tourId={tour.id}
      />

      <TourCapacityDisplay 
        totalCapacity={tour.total_capacity} 
        remainingCapacity={tour.remaining_capacity} 
      />
      
      <SelectableCollectionPointsList
        points={pickupPoints}
        selectedPoint={selectedPoint}
        onPointSelect={onPointSelect}
        isSelectionEnabled={tour.status === "Programmée"}
        tourDepartureDate={tour.departure_date}
      />

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        onClick={onBookingClick}
        disabled={!isBookingEnabled}
      >
        {getBookingButtonText()}
      </Button>
    </div>
  );
}