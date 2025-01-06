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

  if (status === "Livraison terminée") {
    return null;
  }

  // Les 4 étapes principales de la timeline
  const mainStatuses: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours"
  ];

  // Trouver l'index du statut actuel
  const currentIndex = mainStatuses.indexOf(status);

  // Calculer le pourcentage de progression
  const progress = ((currentIndex) / (mainStatuses.length - 1)) * 100;

  return (
    <div className="relative flex justify-between items-center w-full mt-8 px-4">
      <TimelineProgress progress={progress} />
      
      {mainStatuses.map((statusItem, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isNext = index === currentIndex + 1;

        let label = statusItem;
        if (isCompleted) {
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
            isCompleted={isCompleted}
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