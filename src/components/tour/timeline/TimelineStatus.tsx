import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TourStatus } from "@/types/tour";
import { TimelineIcon } from "./TimelineIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const isCompleted = index < currentIndex;
  const isCurrent = index === currentIndex;
  const isNext = index === currentIndex + 1;

  const handleClick = () => {
    if (isNext) {
      onStatusChange(status);
    }
  };

  const getStatusLabel = (status: TourStatus): string => {
    switch (status) {
      case "Programmé":
        return "Programmé";
      case "Ramassage en cours":
        return isCurrent ? "Ramassage en cours" : "Ramassage terminé";
      case "En transit":
        return isCurrent ? "En transit" : "Transport terminé";
      case "Livraison en cours":
        return isCurrent ? "Livraison en cours" : "Livraison terminée";
      default:
        return status;
    }
  };

  const buttonClasses = cn(
    "flex flex-col items-center gap-2 relative",
    isCompleted && "text-primary",
    isCurrent && "text-primary",
    !isCompleted && !isCurrent && "text-gray-500",
    isNext && "cursor-pointer hover:text-primary"
  );

  return (
    <div className="relative z-10">
      <Button
        variant="ghost"
        className={buttonClasses}
        onClick={handleClick}
        disabled={!isNext || currentStatus === "Annulée"}
      >
        <div className={cn(
          "h-12 w-12 rounded-full border-2 flex items-center justify-center",
          isCompleted && "bg-primary border-primary",
          isCurrent && "border-primary",
          !isCompleted && !isCurrent && "border-gray-200"
        )}>
          <TimelineIcon
            status={status}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
            className="h-6 w-6"
          />
        </div>
        <span className="text-xs font-medium whitespace-nowrap">
          {getStatusLabel(status)}
        </span>
      </Button>
    </div>
  );
}