import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";
import { CancelledTimeline } from "./timeline/CancelledTimeline";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  console.log('TourStatusTimeline rendered with status:', status);
  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(status);

  if (status === 'cancelled') {
    return <CancelledTimeline />;
  }

  return (
    <div className="relative flex justify-between items-center w-full mt-4">
      <TimelineProgress 
        currentIndex={currentIndex} 
        statusOrder={statusOrder}
        currentStatus={status}
      />
      
      {statusOrder.map((statusItem, index) => (
        <TimelineStatus
          key={statusItem}
          tourId={tourId}
          status={statusItem}
          currentStatus={status}
          currentIndex={currentIndex}
          index={index}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}