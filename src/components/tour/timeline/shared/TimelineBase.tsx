import { TourStatus } from "@/types/tour";
import { TimelineProgress } from "../TimelineProgress";
import { TimelineIcon } from "../TimelineIcon";
import { TimelineStatus } from "../TimelineStatus";

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
  return (
    <div className="space-y-4">
      <TimelineProgress status={status} />
      <div className="flex items-center gap-2">
        <TimelineIcon status={status} />
        <TimelineStatus 
          status={status}
          isInteractive={isInteractive}
          onStatusChange={onStatusChange}
          tourId={tourId}
        />
      </div>
    </div>
  );
}