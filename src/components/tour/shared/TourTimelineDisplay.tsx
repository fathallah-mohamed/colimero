import { TourStatus } from "@/types/tour";
import { CarrierTimeline } from "../timeline/carrier/CarrierTimeline";
import { ClientTimeline } from "../timeline/client/ClientTimeline";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
  canEdit?: boolean;
}

export function TourTimelineDisplay({
  status,
  onStatusChange,
  tourId,
  canEdit = false,
}: TourTimelineDisplayProps) {
  if (canEdit) {
    return (
      <CarrierTimeline
        status={status}
        onStatusChange={onStatusChange}
        tourId={tourId}
      />
    );
  }

  return <ClientTimeline status={status} />;
}