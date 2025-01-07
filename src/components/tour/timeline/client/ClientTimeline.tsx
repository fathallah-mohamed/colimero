import { TourStatus } from "@/types/tour";
import { TimelineBase } from "../shared/TimelineBase";

interface ClientTimelineProps {
  status: TourStatus;
}

export function ClientTimeline({ status }: ClientTimelineProps) {
  return (
    <TimelineBase 
      status={status}
      isInteractive={false}
    />
  );
}