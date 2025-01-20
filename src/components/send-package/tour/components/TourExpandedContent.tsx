import { Tour } from "@/types/tour";
import { ClientTimeline } from "@/components/tour/timeline/client/ClientTimeline";
import { SelectableCollectionPointsList } from "@/components/tour/SelectableCollectionPointsList";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TourExpandedContentProps {
  tour: Tour;
  selectedPoint: string | null;
  onPointSelect: (city: string) => void;
  onActionClick: () => void;
  isActionEnabled: boolean;
  actionButtonText: string;
}

export function TourExpandedContent({
  tour,
  selectedPoint,
  onPointSelect,
  onActionClick,
  isActionEnabled,
  actionButtonText
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
        />

        <div>
          <h4 className="text-sm font-medium mb-2">Points de collecte</h4>
          <SelectableCollectionPointsList
            points={tour.route}
            selectedPoint={selectedPoint || ''}
            onPointSelect={onPointSelect}
            isSelectionEnabled={tour.status === "Programmée"}
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
    </motion.div>
  );
}