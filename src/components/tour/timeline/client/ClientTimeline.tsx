import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../TimelineStatus";
import { TimelineProgress } from "../TimelineProgress";
import { CancelledStatus } from "../CancelledStatus";
import { motion } from "framer-motion";

interface ClientTimelineProps {
  status: TourStatus;
  tourId: number;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
}

export function ClientTimeline({ status, tourId, onStatusChange }: ClientTimelineProps) {
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const statusOrder: TourStatus[] = [
    "Programmée",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours",
    "Terminée"
  ];

  const currentIndex = statusOrder.indexOf(status);
  const progress = ((currentIndex) / (statusOrder.length - 1)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex justify-between items-center w-full mt-8 px-4"
    >
      <TimelineProgress progress={progress} variant="client" />
      
      {statusOrder.map((statusItem, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isNext = index === currentIndex + 1;

        // Combiner les étapes "Livraison en cours" et "Terminée"
        if (statusItem === "Terminée") {
          return null;
        }

        const label = statusItem === "Livraison en cours" ? "Livraison" : statusItem;

        return (
          <TimelineStatus
            key={statusItem}
            status={statusItem}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            isNext={isNext}
            onClick={() => isNext && onStatusChange?.(tourId, statusItem)}
            label={label}
            variant="client"
          />
        );
      })}
    </motion.div>
  );
}