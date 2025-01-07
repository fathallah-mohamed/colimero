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

  // Map the current status to our simplified timeline steps
  const getTimelineStep = (currentStatus: TourStatus): number => {
    switch (currentStatus) {
      case "Programmé":
        return 0;
      case "Ramassage en cours":
      case "Ramassage terminé":
        return 1;
      case "En transit":
      case "Transport terminé":
      case "Livraison en cours":
        return 2;
      case "Livraison terminée":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getTimelineStep(status);
  const progress = (currentStep / 3) * 100;

  // Define our timeline steps
  const steps = [
    { status: "Programmé" as TourStatus, label: "Planifiée" },
    { status: "Ramassage en cours" as TourStatus, label: "Collecte" },
    { status: "En transit" as TourStatus, label: "Livraison" },
    { status: "Livraison terminée" as TourStatus, label: "Terminée" }
  ];

  return (
    <div className="relative flex flex-col space-y-8 w-full mt-4">
      {/* Progress bar connecting the steps */}
      <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-100">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <motion.div
              key={step.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 z-10"
            >
              <div className={`
                h-12 w-12 rounded-full flex items-center justify-center transition-colors
                ${isCompleted ? 'bg-primary text-white' : 
                  isCurrent ? 'bg-primary text-white border-2 border-primary' : 
                  'bg-white border-2 border-gray-200'}
              `}>
                <TimelineIcon 
                  status={step.status}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  className={isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}
                />
              </div>
              <span className={`
                text-sm font-medium transition-colors
                ${isCompleted ? 'text-primary' : 
                  isCurrent ? 'text-primary' : 
                  'text-gray-400'}
              `}>
                {step.label}
              </span>
              {isCurrent && (
                <span className="text-xs text-muted-foreground">
                  En cours
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}