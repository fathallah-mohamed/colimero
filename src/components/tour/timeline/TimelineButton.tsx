import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { getIcon } from "./timelineUtils";
import { TourStatus } from "@/types/tour";

interface TimelineButtonProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function TimelineButton({ status, isCompleted, isCurrent, onClick, disabled }: TimelineButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-16 h-16 rounded-full p-0 relative transition-all duration-300",
        isCompleted && "bg-primary hover:bg-primary/90",
        isCurrent && "ring-4 ring-primary/20",
        !isCompleted && !isCurrent && "bg-gray-100 hover:bg-gray-200"
      )}
    >
      <div className={cn(
        "absolute inset-0 rounded-full transition-transform duration-500",
        isCompleted && "scale-100",
        !isCompleted && "scale-0"
      )}>
        {isCompleted && !isCurrent && (
          <CheckCircle2 className="h-6 w-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        isCompleted && !isCurrent && "opacity-0",
        (isCurrent || !isCompleted) && "opacity-100"
      )}>
        <div className={cn(
          "text-gray-500",
          isCompleted && "text-white"
        )}>
          {getIcon(status)}
        </div>
      </div>
    </Button>
  );
}