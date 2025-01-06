import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";
import { CancelledStatus } from "./timeline/CancelledStatus";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  console.log('TourStatusTimeline rendered with status:', status);
  
  // Si la tournée est annulée, afficher uniquement le statut d'annulation
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const statusOrder: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours"
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