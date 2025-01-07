import { TourStatus } from "@/types/tour";
import { TourTimelineDisplay } from "@/components/tour/shared/TourTimelineDisplay";

interface TourTimelineProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
}

export function TourTimeline({ status, onStatusChange, tourId }: TourTimelineProps) {
  return (
    <TourTimelineDisplay
      status={status}
      onStatusChange={onStatusChange}
      tourId={tourId}
      canEdit={true}
    />
  );
}