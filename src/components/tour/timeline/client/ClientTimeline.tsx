import { TourStatus } from "@/types/tour";
import { CancelledStatus } from "../CancelledStatus";
import { TimelineProgress } from "../TimelineProgress";
import { TimelineStatus } from "../TimelineStatus";
import { getTimelineProgress, getTimelineLabel } from "../timelineUtils";
import { motion } from "framer-motion";

interface ClientTimelineProps {
  status: TourStatus;
  tourId: number;
}

export function ClientTimeline({ status, tourId }: ClientTimelineProps) {
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const mainStatuses: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison terminée"
  ];

  const currentIndex = mainStatuses.indexOf(status);
  const progress = getTimelineProgress(status);

  return (
    <div className="relative py-8">
      <TimelineProgress progress={progress} />
      
      <div className="relative flex justify-between items-center">
        {mainStatuses.map((statusItem, index) => {
          const isCompleted = index < currentIndex || status === "Livraison terminée";
          const isCurrent = index === currentIndex && status !== "Livraison terminée";
          const isNext = index === currentIndex + 1 && !isCompleted;

          return (
            <motion.div
              key={statusItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex-1 text-center"
            >
              <TimelineStatus
                status={statusItem}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isNext={isNext}
                onClick={() => {}}
                label={getTimelineLabel(statusItem)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}