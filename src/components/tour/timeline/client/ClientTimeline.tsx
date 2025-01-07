import { TourStatus } from "@/types/tour";
import { motion } from "framer-motion";
import { TimelineProgress } from "../TimelineProgress";
import { TimelineStatus } from "../TimelineStatus";
import { getTimelineProgress } from "../timelineUtils";

interface ClientTimelineProps {
  status: TourStatus;
  tourId?: number;
}

export function ClientTimeline({ status }: ClientTimelineProps) {
  if (status === "Annulée") {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <span className="text-red-600 font-medium">Tournée annulée</span>
      </div>
    );
  }

  const steps = [
    { status: "Programmé", label: "Tournée planifiée" },
    { status: "Ramassage en cours", label: "Collecte en cours" },
    { status: "En transit", label: "En transit" },
    { status: "Livraison terminée", label: "Tournée terminée" },
  ] as const;

  const currentStepIndex = steps.findIndex(step => step.status === status);
  const progress = getTimelineProgress(status);

  return (
    <div className="relative pt-8">
      <TimelineProgress progress={progress} />
      
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isNext = index === currentStepIndex + 1;

          return (
            <TimelineStatus
              key={step.status}
              status={step.status as TourStatus}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isNext={isNext}
              onClick={() => {}}
              label={step.label}
            />
          );
        })}
      </div>
    </div>
  );
}