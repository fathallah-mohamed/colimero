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

  // Les 4 étapes principales de la timeline
  const mainStatuses: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours",
    "Livraison terminée"
  ];

  // Trouver l'index du statut actuel
  const currentIndex = mainStatuses.indexOf(status);

  // Si la tournée est terminée, on met la progress à 100%
  const isCompleted = status === "Livraison terminée";
  const progress = isCompleted ? 100 : ((currentIndex) / (mainStatuses.length - 1)) * 100;

  return (
    <div className="relative flex justify-between items-center w-full mt-8 px-4">
      <TimelineProgress progress={progress} />
      
      {mainStatuses.slice(0, -1).map((statusItem, index) => {
        const isCompletedStep = index < currentIndex || isCompleted;
        const isCurrent = index === currentIndex && !isCompleted;
        const isNext = index === currentIndex + 1 && !isCompleted;

        let label = statusItem;
        if (isCompletedStep || isCompleted) {
          switch (statusItem) {
            case "Programmé":
              label = "Préparation terminée";
              break;
            case "Ramassage en cours":
              label = "Ramassage terminé";
              break;
            case "En transit":
              label = "Transport terminé";
              break;
            case "Livraison en cours":
              label = "Livraison terminée";
              break;
          }
        }

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