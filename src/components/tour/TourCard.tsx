import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TourTimeline } from "@/components/transporteur/TourTimeline";
import { TourCapacityDisplay } from "@/components/transporteur/TourCapacityDisplay";
import { TransporteurAvatar } from "@/components/transporteur/TransporteurAvatar";
import { CollectionPointsList } from "./CollectionPointsList";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tour, TourStatus } from "@/types/tour";

interface TourCardProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onBookingClick: () => void;
  isBookingEnabled: boolean;
  isPickupSelectionEnabled: boolean;
  bookingButtonText: string;
  onEdit?: (tour: Tour) => void;
  onDelete?: (tourId: number) => void;
  onStatusChange?: (tourId: number, newStatus: string) => void;
  isCompleted?: boolean;
}

export function TourCard({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  onBookingClick,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
  onEdit,
  onDelete,
  onStatusChange,
  isCompleted
}: TourCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TransporteurAvatar
            avatarUrl={tour.carriers?.avatar_url}
            companyName={tour.carriers?.company_name || ''}
          />
          <div>
            <h3 className="font-medium">{tour.carriers?.company_name}</h3>
            <p className="text-sm text-gray-500">
              Départ le {format(new Date(tour.departure_date), "d MMMM", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Prix au kilo</p>
          <p className="font-medium">
            {tour.carriers?.carrier_capacities?.[0]?.price_per_kg || 5}€
          </p>
        </div>
      </div>

      <TourTimeline status={tour.status as TourStatus} />
      
      <TourCapacityDisplay
        totalCapacity={tour.total_capacity}
        remainingCapacity={tour.remaining_capacity}
      />

      <CollectionPointsList
        points={tour.route}
        selectedPoint={selectedPickupCity}
        onPointSelect={onPickupCitySelect}
        isSelectionEnabled={isPickupSelectionEnabled}
      />

      <Button 
        onClick={onBookingClick}
        className="w-full"
        disabled={!isBookingEnabled}
      >
        {bookingButtonText}
      </Button>
    </Card>
  );
}