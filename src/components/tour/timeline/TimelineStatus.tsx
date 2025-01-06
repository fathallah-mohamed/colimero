import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";
import { TimelineIcon } from "./TimelineIcon";

interface TimelineStatusProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
  isNext: boolean;
  onClick: () => void;
  label: string;
}

export function TimelineStatus({
  status,
  isCompleted,
  isCurrent,
  isNext,
  onClick,
  label
}: TimelineStatusProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        className={cn(
          "h-12 w-12 rounded-full border-2 p-0",
          (isCompleted || status === "Livraison terminée") && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
          isCurrent && "border-primary",
          !isCompleted && !isCurrent && status !== "Livraison terminée" && "border-gray-200"
        )}
        onClick={onClick}
        disabled={!isNext}
      >
        <TimelineIcon 
          status={status} 
          isCompleted={isCompleted || status === "Livraison terminée"}
          isCurrent={isCurrent}
        />
      </Button>
      <span className={cn(
        "text-xs font-medium",
        (isCompleted || status === "Livraison terminée") && "text-primary",
        isCurrent && "text-primary",
        !isCompleted && !isCurrent && status !== "Livraison terminée" && "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  );
}