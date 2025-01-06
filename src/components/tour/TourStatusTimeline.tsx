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
  // Si le statut est annulé, afficher uniquement le statut d'annulation
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  // Définir le statut par défaut si aucun n'est fourni
  const currentStatus = status || "Programmé";

  // Les étapes principales de la timeline
  const mainStatuses: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours",
    "Livraison terminée"
  ];

  // Trouver l'index du statut actuel
  const currentIndex = mainStatuses.indexOf(currentStatus);

  // Si la tournée est terminée, on met la progress à 100%
  const isCompleted = currentStatus === "Livraison terminée";
  const progress = isCompleted ? 100 : ((currentIndex) / (mainStatuses.length - 1)) * 100;

  return (
    <div className="relative flex justify-between items-center w-full mt-8 px-4">
      <TimelineProgress progress={progress} />
      
      {mainStatuses.map((statusItem, index) => {
        // Un statut est complété s'il est avant le statut actuel
        const isCompletedStep = index < currentIndex;
        // Le statut est actif s'il correspond au statut actuel
        const isCurrent = index === currentIndex;
        // Le prochain statut est celui qui suit le statut actuel
        const isNext = index === currentIndex + 1 && !isCompleted;

        // Déterminer le label à afficher en fonction de l'état du statut
        let label = statusItem;
        if (isCompletedStep) {
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