import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimelineIcon } from "./TimelineIcon";
import { TourStatus } from "@/types/tour";
import { useTimelineTransition } from "./useTimelineTransition";

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

  const getStatusLabel = (status: TourStatus) => {
    switch (status) {
      case 'planned':
        return "Planifiée";
      case 'collecting':
        return "Collecte";
      case 'in_transit':
        return "Livraison";
      case 'completed':
        return "Terminée";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isCompleted && "bg-primary shadow-lg",
          isCurrent && "ring-2 ring-primary ring-offset-2",
          !isCompleted && !isCurrent && "bg-gray-100",
          isClickable && "cursor-pointer hover:scale-105"
        )}
        onClick={handleClick}
      >
        <TimelineIcon 
          status={status}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          className="h-6 w-6"
        />
      </div>
      
      <div className="mt-3 text-center">
        <span className={cn(
          "text-sm font-medium block",
          isCurrent ? "text-primary" : isCompleted ? "text-primary" : "text-gray-500"
        )}>
          {getStatusLabel(status)}
        </span>
        {isCurrent && (
          <span className="text-xs text-gray-500 mt-1 block">
            Statut actuel
          </span>
        )}
      </div>
    </div>
  );
}