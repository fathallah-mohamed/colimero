import { TourStatus } from "@/types/tour";
import { TimelineProgress } from "../TimelineProgress";
import { TimelineIcon } from "../TimelineIcon";
import { CancelledStatus } from "../CancelledStatus";
import { motion } from "framer-motion";

interface ClientTimelineProps {
  status: TourStatus;
  tourId?: number;
}

export function ClientTimeline({ status, tourId }: ClientTimelineProps) {
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  // Les étapes principales de la timeline
  const mainStatuses: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison terminée"
  ];

  // Trouver l'index du statut actuel
  const currentIndex = mainStatuses.indexOf(status);

  // Si la tournée est terminée, on met la progress à 100%
  const isCompleted = status === "Livraison terminée";
  const progress = isCompleted ? 100 : ((currentIndex) / (mainStatuses.length - 1)) * 100;

  return (
    <div className="relative flex flex-col space-y-8 w-full mt-4">
      <TimelineProgress progress={progress} />
      
      <div className="flex justify-between items-center px-4">
        {mainStatuses.map((statusItem, index) => {
          const isCompletedStep = index < currentIndex || isCompleted;
          const isCurrent = index === currentIndex && !isCompleted;

          let label = statusItem;
          if (statusItem === "Programmé") label = "Planifiée";
          if (statusItem === "Ramassage en cours") label = "Collecte";
          if (statusItem === "En transit") label = "Livraison";
          if (statusItem === "Livraison terminée") label = "Terminée";

          return (
            <motion.div
              key={statusItem}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`
                h-12 w-12 rounded-full flex items-center justify-center
                ${isCompletedStep ? 'bg-success text-white' : 
                  isCurrent ? 'bg-primary text-white' : 
                  'bg-gray-100 text-gray-400'}
              `}>
                <TimelineIcon 
                  status={statusItem} 
                  isCompleted={isCompletedStep}
                  isCurrent={isCurrent}
                />
              </div>
              <span className={`
                text-sm font-medium
                ${isCompletedStep ? 'text-success' : 
                  isCurrent ? 'text-primary' : 
                  'text-gray-400'}
              `}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}