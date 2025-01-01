import { cn } from "@/lib/utils";
import { TourStatus } from "@/types/tour";

interface TimelineProgressProps {
  currentIndex: number;
  statusOrder: TourStatus[];
}

export function TimelineProgress({ currentIndex, statusOrder }: TimelineProgressProps) {
  return (
    <>
      <div className="absolute top-8 left-0 h-0.5 bg-gray-200 w-full -z-10" />
      <div 
        className="absolute top-8 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
        style={{ 
          width: `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
        }} 
      />
    </>
  );
}