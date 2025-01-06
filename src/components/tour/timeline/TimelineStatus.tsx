import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TourStatus } from "@/types/tour";
import { TimelineIcon } from "./TimelineIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const { data: tourStatuses } = useQuery({
    queryKey: ['tourStatuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_statuses')
        .select('name')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const isCompleted = index < currentIndex;
  const isCurrent = index === currentIndex;

  const handleClick = () => {
    if (index === currentIndex + 1) {
      onStatusChange(status);
    }
  };

  const buttonClasses = cn(
    "flex flex-col items-center gap-2 relative",
    isCompleted && "text-primary",
    isCurrent && "text-primary",
    !isCompleted && !isCurrent && "text-gray-500",
    index === currentIndex + 1 && "cursor-pointer hover:text-primary"
  );

  if (!tourStatuses) return null;

  return (
    <div className="relative z-10">
      <Button
        variant="ghost"
        className={buttonClasses}
        onClick={handleClick}
        disabled={index !== currentIndex + 1}
      >
        <TimelineIcon
          status={status}
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          className="h-6 w-6"
        />
        <span className="text-xs font-medium">{status}</span>
      </Button>
    </div>
  );
}