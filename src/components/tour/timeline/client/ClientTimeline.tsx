import { TourStatus } from "@/types/tour";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { 
      icon: CalendarDays,
      label: "Planifiée",
      status: "Programmé" as TourStatus 
    },
    { 
      icon: Package,
      label: "Collecte",
      status: "Ramassage en cours" as TourStatus 
    },
    { 
      icon: Truck,
      label: "Livraison",
      status: "En transit" as TourStatus 
    },
    { 
      icon: CheckCircle2,
      label: "Terminée",
      status: "Livraison terminée" as TourStatus 
    }
  ];

  return (
    <div className="relative flex flex-col space-y-8 w-full mt-4">
      {/* Progress bar connecting the steps */}
      <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-100">
        <motion.div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="relative flex justify-between items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center gap-2 z-10"
            >
              <motion.div 
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-300",
                  isCompleted ? "bg-primary text-white shadow-lg shadow-primary/20" : 
                  isCurrent ? "bg-primary text-white shadow-lg shadow-primary/20" : 
                  "bg-white border-2 border-gray-200"
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5",
                    isCompleted || isCurrent ? "text-white" : "text-gray-400"
                  )} 
                />
              </motion.div>
              <div className="flex flex-col items-center gap-1">
                <span 
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isCompleted ? "text-primary" : 
                    isCurrent ? "text-primary" : 
                    "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.span 
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    En cours
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}