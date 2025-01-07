import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../TimelineStatus";
import { TimelineProgress } from "../TimelineProgress";
import { CancelledStatus } from "../CancelledStatus";
import { motion } from "framer-motion";

interface ClientTimelineProps {
  status: TourStatus;
}

export function ClientTimeline({ status }: ClientTimelineProps) {
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
          <motion.div
            key={statusItem}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TimelineStatus
              status={statusItem}
              isCompleted={isCompletedStep}
              isCurrent={isCurrent}
              isNext={isNext}
              onClick={() => {}}
              label={label}
            />
          </motion.div>
        );
      })}
    </div>
  );
}