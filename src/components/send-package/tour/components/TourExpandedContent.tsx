import { Tour, TourStatus } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { motion } from "framer-motion";
import { TourButton } from "./TourButton";
import { ApprovalRequest } from "@/hooks/approval-requests/types";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPickupCity: string | null;
  onPickupCitySelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  existingRequest: ApprovalRequest | null;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function TourExpandedContent({
  tour,
  selectedPickupCity,
  onPickupCitySelect,
  onActionClick,
  isActionEnabled,
  existingRequest,
  onStatusChange
}: TourExpandedContentProps) {
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

        <div>
          <TourButton
            tour={tour}
            existingRequest={existingRequest}
            isActionEnabled={isActionEnabled}
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </motion.div>
  );
}