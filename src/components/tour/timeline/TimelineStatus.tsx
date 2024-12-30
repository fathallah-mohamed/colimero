import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimelineIcon } from "./TimelineIcon";
import { TourStatus } from "../../../types/tour";

interface TimelineStatusProps {
  status: TourStatus;
  currentStatus: TourStatus;
  currentIndex: number;
  index: number;
  onClick: () => void;
}

export function TimelineStatus({ status, currentStatus, currentIndex, index, onClick }: TimelineStatusProps) {
  const isCompleted = index < currentIndex;
  const isCurrent = status === currentStatus;

  return (
    <div className="flex flex-col items-center relative">
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          "rounded-full p-0 h-16 w-16 transition-all duration-200",
          index <= currentIndex && "hover:bg-gray-100",
          status === currentStatus && "ring-2 ring-primary ring-offset-2"
        )}
        onClick={onClick}
        disabled={index > currentIndex + 1}
      >
        <TimelineIcon 
          status={status} 
          isCompleted={isCompleted} 
          isCurrent={isCurrent} 
        />
      </Button>
      <span className={cn(
        "text-sm mt-3 font-medium",
        status === currentStatus ? "text-primary" : "text-gray-500"
      )}>
        {status === 'planned' && "Planifiée"}
        {status === 'collecting' && "Collecte"}
        {status === 'in_transit' && "Livraison"}
        {status === 'completed' && "Terminée"}
      </span>
    </div>
  );
}