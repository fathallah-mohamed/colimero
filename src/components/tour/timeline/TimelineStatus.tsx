import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimelineIcon } from "./TimelineIcon";
import { TourStatus } from "@/types/tour";
import { useTimelineTransition } from "./useTimelineTransition";
import { Check } from "lucide-react";

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

  return (
    <div className="flex flex-col items-center relative">
      {isCompleted && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-1">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          "rounded-full p-0 h-16 w-16 transition-all duration-200",
          isClickable && "hover:bg-gray-100 cursor-pointer",
          isCurrent && "ring-2 ring-primary ring-offset-2",
          isCompleted && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        onClick={handleClick}
        disabled={!isClickable}
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
        isCurrent ? "text-primary" : "text-gray-500"
      )}>
        {status === 'planned' && "Planifiée"}
        {status === 'collecting' && "Collecte"}
        {status === 'in_transit' && "Livraison"}
        {status === 'completed' && "Terminée"}
      </span>
    </div>
  );
}