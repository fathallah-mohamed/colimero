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
  const isCompleted = index < currentIndex || (status === 'planned' && currentStatus !== 'planned');
  const isCurrent = status === currentStatus;
  const isClickable = Math.abs(index - currentIndex) === 1 && !['cancelled', 'completed_completed'].includes(currentStatus);

  // Fetch status labels from database
  const { data: statusLabels } = useQuery({
    queryKey: ['tourStatuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_statuses')
        .select('code, label, description');
      
      if (error) throw error;
      return data.reduce((acc: Record<string, { label: string }>, curr) => {
        acc[curr.code] = { label: curr.label };
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

  const getStatusLabel = (status: TourStatus) => {
    if (!statusLabels) {
      switch (status) {
        case 'planned':
          return currentStatus !== 'planned' ? 'Préparation terminée' : 'Programmée';
        case 'collecting':
          return currentStatus === 'collecting' ? 'Ramassage en cours' : 'Ramassage terminé';
        case 'in_transit':
          return currentStatus === 'in_transit' ? 'En transit' : 'Transport terminé';
        case 'completed':
          if (currentStatus === 'completed_completed') {
            return 'Livrée';
          }
          return currentStatus === 'completed' ? 'Livraison en cours' : 'Livrée';
        default:
          return status;
      }
    }

    const statusInfo = statusLabels[status];
    if (status === 'planned' && currentStatus !== 'planned') {
      return 'Préparation terminée';
    }
    if (status === 'collecting' && currentStatus !== 'collecting' && currentStatus !== 'planned') {
      return 'Ramassage terminé';
    }
    if (status === 'in_transit' && currentStatus !== 'in_transit' && !['planned', 'collecting'].includes(currentStatus)) {
      return 'Transport terminé';
    }
    if (status === 'completed') {
      if (currentStatus === 'completed_completed') {
        return 'Livrée';
      }
      return currentStatus === 'completed' ? 'Livraison en cours' : 'Livrée';
    }
    return statusInfo ? statusInfo.label : status;
  };

  return (
    <div className="flex flex-col items-center relative">
      <motion.div 
        whileHover={isClickable ? { scale: 1.05 } : {}}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
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
          {getStatusLabel(status)}
        </motion.span>
      </div>
    </div>
  );
}