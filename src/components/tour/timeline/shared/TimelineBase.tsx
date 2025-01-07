import { TourStatus } from "@/types/tour";
import { TimelineProgress } from "../TimelineProgress";
import { TimelineIcon } from "../TimelineIcon";
import { TimelineStatus } from "../TimelineStatus";
import { getTimelineProgress } from "../timelineUtils";
import { CancelledStatus } from "../CancelledStatus";

interface TimelineBaseProps {
  status: TourStatus;
  isInteractive?: boolean;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId?: number;
}

export function TimelineBase({
  status,
  isInteractive = false,
  onStatusChange,
  tourId,
}: TimelineBaseProps) {
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const progress = getTimelineProgress(status);

  return (
    <div className="space-y-4">
      <TimelineProgress progress={progress} />
      <div className="flex items-center gap-2">
        <TimelineIcon 
          status={status}
          isCompleted={status === "Livraison terminée"}
          isCurrent={status !== "Livraison terminée"}
        />
        <TimelineStatus 
          status={status}
          isCompleted={status === "Livraison terminée"}
          isCurrent={status !== "Livraison terminée"}
          isNext={false}
          onClick={() => {}}
          label={status}
        />
      </div>
    </div>
  );
}