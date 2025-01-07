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
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const currentStatus = status || "Programmée";

  const mainStatuses: TourStatus[] = [
    "Programmée",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours",
    "Terminée"
  ];

  const currentIndex = mainStatuses.indexOf(currentStatus);
  const isCompleted = currentStatus === "Terminée";
  const progress = isCompleted ? 100 : ((currentIndex) / (mainStatuses.length - 1)) * 100;

  return (
    <div className="relative flex justify-between items-center w-full mt-8 px-4">
      <TimelineProgress progress={progress} />
      
      {mainStatuses.map((statusItem, index) => {
        const isCompletedStep = index < currentIndex || isCompleted;
        const isCurrent = index === currentIndex && !isCompleted;
        const isNext = index === currentIndex + 1 && !isCompleted;

        // Combiner les étapes "Livraison en cours" et "Terminée"
        if (statusItem === "Terminée") {
          return null;
        }

        const label = statusItem === "Livraison en cours" ? "Livraison" : statusItem;

        return (
          <TimelineStatus
            key={statusItem}
            status={statusItem}
            isCompleted={isCompletedStep}
            isCurrent={isCurrent}
            isNext={isNext}
            onClick={() => isNext && onStatusChange(statusItem)}
            label={label}
          />
        );
      })}
    </div>
  );
}