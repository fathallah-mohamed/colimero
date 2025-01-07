import { TourStatus } from "@/types/tour";
import { CarrierTimeline } from "../timeline/carrier/CarrierTimeline";
import { ClientTimeline } from "../timeline/client/ClientTimeline";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
  userType?: string;
  canEdit?: boolean;
}

export function TourTimelineDisplay({ 
  status, 
  onStatusChange, 
  tourId,
  userType,
  canEdit = false
}: TourTimelineDisplayProps) {
  // Si c'est un transporteur et qu'il peut éditer
  if (userType === 'carrier' && canEdit && onStatusChange) {
    return (
      <CarrierTimeline
        status={status}
        onStatusChange={onStatusChange}
        tourId={tourId}
      />
    );
  }

  // Pour tous les autres cas (clients ou vue en lecture seule)
  return (
    <ClientTimeline
      status={status}
      tourId={tourId}
    />
  );
}