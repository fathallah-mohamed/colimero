import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";
import { TimelineIcon } from "./TimelineIcon";

interface TimelineButtonProps {
  status: TourStatus;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function TimelineButton({
  status,
  isCompleted,
  isCurrent,
  onClick,
  disabled
}: TimelineButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "h-16 w-16 rounded-full border-2",
        isCompleted && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        isCurrent && "border-primary",
        !isCompleted && !isCurrent && "border-gray-200"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <TimelineIcon 
        status={status} 
        isCompleted={isCompleted}
        isCurrent={isCurrent}
        className={cn(
          "h-6 w-6",
          isCompleted && "text-primary-foreground",
          !isCompleted && "text-gray-500"
        )} 
      />
    </Button>
  );
}