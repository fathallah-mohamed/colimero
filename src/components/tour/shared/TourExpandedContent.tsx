import { Tour, TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { TourTimelineDisplay } from "@/components/tour/shared/TourTimelineDisplay";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  userType?: string;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  onActionClick,
  isActionEnabled,
  actionButtonText,
  userType,
  onStatusChange
}: TourExpandedContentProps) {
  const isPickupSelectionEnabled = () => {
    return tour.status === "Programmée" && userType !== 'admin';
  };

  return (
    <div className="pt-6 space-y-6">
      <TourTimelineDisplay 
        status={tour.status} 
        tourId={tour.id}
        variant="client"
        onStatusChange={onStatusChange}
      />

      <div>
        <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
        <SelectableCollectionPointsList
          points={tour.route}
          selectedPoint={selectedPickupCity || ''}
          onPointSelect={onPickupCitySelect}
          isSelectionEnabled={isPickupSelectionEnabled()}
          tourDepartureDate={tour.departure_date}
        />
      </div>

      <div>
        <Button 
          onClick={onActionClick}
          className="w-full bg-[#0FA0CE] hover:bg-[#0FA0CE]/90 text-white"
          disabled={!isActionEnabled}
        >
          {actionButtonText}
        </Button>
      </div>
    </div>
  );
}