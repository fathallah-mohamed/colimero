import { TourStatus } from "../../types/tour";
import { TimelineButton } from "./timeline/TimelineButton";
import { TimelineProgress } from "./timeline/TimelineProgress";
import { CancelledTimeline } from "./timeline/CancelledTimeline";
import { useTimelineTransition } from "./timeline/useTimelineTransition";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "./timeline/timelineUtils";

interface TourStatusTimelineProps {
  tourId: number;
  currentStatus: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
  isCompleted?: boolean;
}

export function TourStatusTimeline({ 
  tourId, 
  currentStatus, 
  onStatusChange,
  isCompleted = false 
}: TourStatusTimelineProps) {
  const { handleStatusChange, isUpdating } = useTimelineTransition(tourId, onStatusChange);

  if (currentStatus === 'cancelled') {
    return <CancelledTimeline />;
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="relative flex justify-between items-center">
        {statusOrder.map((status, index) => {
          const isStatusCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = !isCompleted && !isUpdating && (
            index === currentIndex + 1 || 
            (status === 'collecting' && currentStatus === 'in_transit') ||
            (status === 'planned' && currentStatus === 'collecting')
          );
          
          return (
            <div key={status} className="flex flex-col items-center relative z-10">
              <TimelineButton
                status={status}
                isCompleted={isStatusCompleted}
                isCurrent={isCurrent}
                onClick={() => isClickable && handleStatusChange(currentStatus, status)}
                disabled={!isClickable || isUpdating}
              />
              <span className={cn(
                "mt-4 text-sm font-medium whitespace-nowrap",
                isCurrent && "text-primary font-semibold",
                !isCurrent && "text-gray-500"
              )}>
                {getStatusLabel(status)}
              </span>
            </div>
          );
        })}
        
        <TimelineProgress currentIndex={currentIndex} statusOrder={statusOrder} />
      </div>
    </div>
  );
}