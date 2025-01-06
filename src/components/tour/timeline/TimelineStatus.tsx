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
  const isClickable = Math.abs(index - currentIndex) === 1 && currentStatus !== 'cancelled' && currentStatus !== 'completed';

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
      case 'cancelled':
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          "rounded-full p-0 h-16 w-16 transition-all duration-200",
          isClickable && "hover:bg-gray-100 cursor-pointer",
          isCurrent && "ring-2 ring-primary ring-offset-2",
          currentStatus === 'cancelled' && "opacity-50"
        )}
        onClick={handleClick}
        disabled={!isClickable || currentStatus === 'cancelled'}
      >
        <TimelineIcon 
          status={status}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          className="h-6 w-6"
        />
      </Button>
      <span className={cn(
        "text-sm mt-3 font-medium",
        isCurrent ? "text-primary" : "text-gray-500",
        isCompleted ? "text-primary" : "",
        currentStatus === 'cancelled' && index > currentIndex && "line-through opacity-50"
      )}>
        {getStatusLabel(status)}
      </span>
    </div>
  );
}