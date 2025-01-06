import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  console.log('TourStatusTimeline rendered with status:', status);
  
  // Initial status order shown at creation
  const initialStatusOrder: TourStatus[] = [
    'planned',
    'collecting_completed',
    'transport_completed',
    'completed_completed'
  ];

  // Status transitions based on current status
  const getStatusOrder = (currentStatus: TourStatus): TourStatus[] => {
    switch (currentStatus) {
      case 'preparation_completed':
        return ['planned', 'collecting', 'in_transit', 'delivery_in_progress'];
      case 'collecting':
        return ['planned', 'collecting', 'in_transit', 'delivery_in_progress'];
      case 'collecting_completed':
        return ['planned', 'collecting_completed', 'in_transit', 'delivery_in_progress'];
      case 'in_transit':
        return ['planned', 'collecting_completed', 'in_transit', 'delivery_in_progress'];
      case 'transport_completed':
        return ['planned', 'collecting_completed', 'transport_completed', 'delivery_in_progress'];
      case 'delivery_in_progress':
        return ['planned', 'collecting_completed', 'transport_completed', 'delivery_in_progress'];
      case 'completed_completed':
        return ['planned', 'collecting_completed', 'transport_completed', 'completed_completed'];
      default:
        return initialStatusOrder;
    }
  };

  const statusOrder = getStatusOrder(status);
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="relative flex justify-between items-center w-full mt-4">
      <TimelineProgress currentIndex={currentIndex} statusOrder={statusOrder} />
      
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