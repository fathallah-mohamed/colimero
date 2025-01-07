import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../TimelineStatus";
import { TimelineProgress } from "../TimelineProgress";
import { CancelledStatus } from "../CancelledStatus";
import { motion } from "framer-motion";

interface ClientTimelineProps {
  status: TourStatus;
  tourId: number;
}

export function ClientTimeline({ status, tourId }: ClientTimelineProps) {
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
            onClick={() => {}}
            label={label}
            variant="client"
          />
        );
      })}
    </motion.div>
  );
}