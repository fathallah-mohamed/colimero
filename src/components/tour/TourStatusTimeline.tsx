import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { TimelineProgress } from "./timeline/TimelineProgress";
import { CancelledStatus } from "./timeline/CancelledStatus";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface TourStatusTimelineProps {
  tourId: number;
  status: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, status, onStatusChange }: TourStatusTimelineProps) {
  if (status === 'cancelled') {
    return <CancelledStatus />;
  }
  
  const mainStatusOrder: TourStatus[] = [
    'planned',
    'collecting',
    'in_transit',
    'delivery_in_progress'
  ];

  const currentIndex = mainStatusOrder.indexOf(status);

  const handleCancel = () => {
    onStatusChange('cancelled');
  };

  return (
    <div className="space-y-6">
      <div className="relative flex justify-between items-center w-full mt-4">
        <TimelineProgress currentIndex={currentIndex} statusOrder={mainStatusOrder} />
        
        {mainStatusOrder.map((statusItem, index) => (
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

      {status !== 'completed_completed' && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Annuler la tournée
          </Button>
        </div>
      )}
    </div>
  );
}