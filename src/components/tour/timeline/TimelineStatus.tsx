import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";
import { Circle, CheckCircle2 } from "lucide-react";

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
          "h-12 w-12 rounded-full p-0 transition-all duration-200",
          isCompleted && "bg-primary text-primary-foreground hover:bg-primary/90",
          isCurrent && "border-2 border-primary",
          !isCompleted && !isCurrent && "border-gray-200"
        )}
        onClick={onClick}
        disabled={!isNext}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6" />
        ) : (
          <Circle className={cn(
            "h-6 w-6",
            isCurrent ? "text-primary" : "text-gray-400"
          )} />
        )}
      </Button>
      <span className={cn(
        "text-xs font-medium",
        isCompleted && "text-primary",
        isCurrent && "text-primary font-semibold",
        !isCompleted && !isCurrent && "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  );
}