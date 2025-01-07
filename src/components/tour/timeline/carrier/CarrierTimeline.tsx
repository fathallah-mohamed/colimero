import { TourStatus } from "@/types/tour";
import { TimelineBase } from "../shared/TimelineBase";
import { TimelineButton } from "../TimelineButton";
import { useState } from "react";

interface CarrierTimelineProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
}

export function CarrierTimeline({ status, onStatusChange, tourId }: CarrierTimelineProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: TourStatus) => {
    if (!onStatusChange) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <TimelineBase 
        status={status}
        isInteractive={true}
        onStatusChange={handleStatusChange}
        tourId={tourId}
      />
      
      {status !== "Annulée" && (
        <TimelineButton
          status={status}
          isCompleted={status === "Livraison terminée"}
          isCurrent={status !== "Livraison terminée" && status !== "Annulée"}
          onClick={() => handleStatusChange("Annulée")}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}