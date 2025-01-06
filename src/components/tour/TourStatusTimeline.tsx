import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  console.log('TourStatusTimeline rendered with status:', status);
  const statusOrder: TourStatus[] = [
    "Programmé",
    "Préparation terminée",
    "Ramassage en cours",
    "Ramassage terminé",
    "En transit",
    "Transport terminé",
    "Livraison en cours",
    "Livraison terminée"
  ];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="relative flex justify-between items-center w-full mt-4">
      <TimelineProgress currentIndex={currentIndex} statusOrder={statusOrder} />
      
      {statusOrder.map((statusItem, index) => (
        <TimelineStatus
          key={statusItem}
          tourId={tourId}
          status={statusItem}
          currentStatus={status}
          currentIndex={currentIndex}
          index={index}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}