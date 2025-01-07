import { TourStatus } from "@/types/tour";
import { TimelineBase } from "../shared/TimelineBase";

interface ClientTimelineProps {
  status: TourStatus;
  tourId: number;
}

export function ClientTimeline({ status, tourId }: ClientTimelineProps) {
  return (
    <TimelineBase 
      status={status} 
      tourId={tourId}
      isInteractive={false}
      showCancelButton={false}
    />
  );
}