import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";

interface TimelineProgressProps {
  currentIndex: number;
  statusOrder: TourStatus[];
  currentStatus: TourStatus;
}

export function TimelineProgress({ currentIndex, statusOrder, currentStatus }: TimelineProgressProps) {
  const progressWidth = `${(currentIndex / (statusOrder.length - 1)) * 100}%`;

  return (
    <>
      <div className="absolute top-8 left-0 h-0.5 bg-gray-200 w-full -z-10" />
      <div 
        className={cn(
          "absolute top-8 left-0 h-0.5 transition-all duration-500 -z-10",
          currentStatus === 'cancelled' ? "bg-red-500" : "bg-primary"
        )}
        style={{ width: progressWidth }} 
      />
    </>
  );
}