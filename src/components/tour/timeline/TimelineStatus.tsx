import { cn } from "@/lib/utils";
import { TimelineIcon } from "./TimelineIcon";
import { TourStatus } from "@/types/tour";
import { useTimelineTransition } from "./useTimelineTransition";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimelineStatusProps {
  tourId: number;
  status: TourStatus;
  currentStatus: TourStatus;
  currentIndex: number;
  index: number;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TimelineStatus({ 
  tourId,
  status, 
  currentStatus, 
  currentIndex, 
  index, 
  onStatusChange 
}: TimelineStatusProps) {
  const { handleStatusChange } = useTimelineTransition(tourId, onStatusChange);
  const isCompleted = index < currentIndex;
  const isCurrent = status === currentStatus;
  const isClickable = Math.abs(index - currentIndex) === 1 && !['cancelled', 'completed'].includes(currentStatus);

  // Fetch status labels from database
  const { data: statusLabels } = useQuery({
    queryKey: ['tourStatuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_statuses')
        .select('code, label, description');
      
      if (error) throw error;
      return data.reduce((acc: Record<string, { label: string, completedLabel?: string }>, curr) => {
        if (curr.code.endsWith('_completed')) {
          const baseStatus = curr.code.replace('_completed', '');
          if (acc[baseStatus]) {
            acc[baseStatus].completedLabel = curr.label;
          } else {
            acc[baseStatus] = { label: '', completedLabel: curr.label };
          }
        } else {
          if (acc[curr.code]) {
            acc[curr.code].label = curr.label;
          } else {
            acc[curr.code] = { label: curr.label };
          }
        }
        return acc;
      }, {});
    }
  });

  const handleClick = async () => {
    console.log('Click detected on status:', status);
    console.log('Current status:', currentStatus);
    console.log('Is clickable:', isClickable);
    
    if (isClickable) {
      console.log('Attempting status change from', currentStatus, 'to', status);
      await handleStatusChange(currentStatus, status);
    }
  };

  const getStatusLabel = (status: TourStatus, isCompleted: boolean) => {
    if (!statusLabels) return '';

    const statusInfo = statusLabels[status];
    if (!statusInfo) return status;

    return isCompleted ? (statusInfo.completedLabel || statusInfo.label) : statusInfo.label;
  };

  return (
    <div className="flex flex-col items-center relative">
      <motion.div 
        whileHover={isClickable ? { scale: 1.05 } : {}}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isCompleted && "bg-primary shadow-lg",
          isCurrent && "ring-4 ring-primary/30 bg-white",
          !isCompleted && !isCurrent && "bg-gray-100",
          isClickable && "cursor-pointer hover:shadow-md"
        )}
        onClick={handleClick}
      >
        <TimelineIcon 
          status={status}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          className={cn(
            "h-6 w-6",
            isCompleted && "text-white",
            isCurrent && "text-primary",
            !isCompleted && !isCurrent && "text-gray-400"
          )}
        />
      </motion.div>
      
      <div className="mt-3 text-center">
        <motion.span 
          className={cn(
            "text-sm font-medium block",
            isCurrent && "text-primary font-semibold",
            isCompleted && "text-primary",
            !isCompleted && !isCurrent && "text-gray-500"
          )}
          animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
        >
          {getStatusLabel(status, isCompleted)}
        </motion.span>
      </div>
    </div>
  );
}