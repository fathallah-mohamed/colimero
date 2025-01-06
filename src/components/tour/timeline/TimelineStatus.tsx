import { cn } from "@/lib/utils";
import { TimelineIcon } from "./TimelineIcon";
import { TourStatus } from "@/types/tour";
import { useTimelineTransition } from "./useTimelineTransition";
import { motion } from "framer-motion";

interface TimelineStatusProps {
  tourId: number;
  status: TourStatus;
  currentStatus: TourStatus;
  currentIndex: number;
  index: number;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TimelineStatus({ 
  tourId,
  status, 
  currentStatus, 
  currentIndex, 
  index, 
  onStatusChange 
}: TimelineStatusProps) {
  const { handleStatusChange } = useTimelineTransition(tourId, onStatusChange);
  const isCompleted = index < currentIndex;
  const isCurrent = status === currentStatus;
  const isClickable = Math.abs(index - currentIndex) === 1 && !['cancelled', 'completed'].includes(currentStatus);

  const handleClick = async () => {
    console.log('Click detected on status:', status);
    console.log('Current status:', currentStatus);
    console.log('Is clickable:', isClickable);
    
    if (isClickable) {
      console.log('Attempting status change from', currentStatus, 'to', status);
      await handleStatusChange(currentStatus, status);
    }
  };

  const getStatusLabel = (status: TourStatus, isCompleted: boolean) => {
    switch (status) {
      case 'planned':
        return isCompleted ? "Préparation terminée" : "Planifiée";
      case 'collecting':
        return isCompleted ? "Ramassage terminé" : "En cours de collecte";
      case 'in_transit':
        return isCompleted ? "Transport effectué" : "En transit";
      case 'completed':
        return "Tournée terminée";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <motion.div 
        whileHover={isClickable ? { scale: 1.05 } : {}}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isCompleted && "bg-primary shadow-lg",
          isCurrent && "ring-4 ring-primary/30 bg-white",
          !isCompleted && !isCurrent && "bg-gray-100",
          isClickable && "cursor-pointer hover:shadow-md"
        )}
        onClick={handleClick}
      >
        <TimelineIcon 
          status={status}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          className={cn(
            "h-6 w-6",
            isCompleted && "text-white",
            isCurrent && "text-primary",
            !isCompleted && !isCurrent && "text-gray-400"
          )}
        />
      </motion.div>
      
      <div className="mt-3 text-center">
        <motion.span 
          className={cn(
            "text-sm font-medium block",
            isCurrent && "text-primary font-semibold",
            isCompleted && "text-primary",
            !isCompleted && !isCurrent && "text-gray-500"
          )}
          animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
        >
          {getStatusLabel(status, isCompleted)}
        </motion.span>
      </div>
    </div>
  );
}