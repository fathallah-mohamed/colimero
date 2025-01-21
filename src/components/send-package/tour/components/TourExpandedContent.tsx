import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
  userType?: string;
  hasPendingRequest?: boolean;
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
  hasPendingRequest,
  onStatusChange
}: TourExpandedContentProps) {
  const getButtonStyle = () => {
    if (!isActionEnabled || hasPendingRequest) {
      if (actionButtonText === "Demande rejetée") {
        return "bg-red-500 hover:bg-red-500 cursor-not-allowed opacity-50";
      }
      if (actionButtonText === "Demande en attente d'approbation") {
        return "bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed opacity-50";
      }
    }
    return "bg-[#0FA0CE] hover:bg-[#0FA0CE]/90";
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="pt-6 space-y-6">
        <ClientTimeline 
          status={tour.status} 
          tourId={tour.id}
          onStatusChange={onStatusChange}
        />

        <div>
          <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
          <SelectableCollectionPointsList
            points={tour.route}
            selectedPoint={selectedPickupCity || ''}
            onPointSelect={onPickupCitySelect}
            isSelectionEnabled={tour.status === "Programmée"}
            tourDepartureDate={tour.departure_date}
          />
        </div>

        {userType === 'client' && tour.status === "Programmée" && (
          <div>
            <Button 
              onClick={onActionClick}
              className={`w-full text-white ${getButtonStyle()}`}
              disabled={!isActionEnabled || hasPendingRequest}
            >
              {actionButtonText}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}