import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../TimelineStatus";
import { TimelineProgress } from "../TimelineProgress";
import { CancelledStatus } from "../CancelledStatus";
import { motion } from "framer-motion";

interface TimelineBaseProps {
  status: TourStatus;
  statusOrder: TourStatus[];
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  canEdit?: boolean;
  renderCancelButton?: () => React.ReactNode;
  getStatusLabel: (status: TourStatus, isCompleted: boolean) => string;
}

export function TimelineBase({ 
  status,
  statusOrder,
  onStatusChange,
  canEdit = false,
  renderCancelButton,
  getStatusLabel
}: TimelineBaseProps) {
  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const currentIndex = statusOrder.indexOf(status);
  const progress = ((currentIndex) / (statusOrder.length - 1)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="relative flex justify-between items-center w-full mt-8 px-4">
        <TimelineProgress progress={progress} />
        
        {statusOrder.map((statusItem, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isNext = index === currentIndex + 1;

          const label = getStatusLabel(statusItem, isCompleted);

          return (
            <TimelineStatus
              key={statusItem}
              status={statusItem}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isNext={isNext && canEdit}
              onClick={() => isNext && canEdit && onStatusChange && onStatusChange(statusItem)}
              label={label}
            />
          );
        })}
      </div>

      {renderCancelButton && renderCancelButton()}
    </motion.div>
  );
}