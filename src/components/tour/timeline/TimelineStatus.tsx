import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TourStatus } from "@/types/tour";

interface TimelineStatusProps {
  status: TourStatus;
}

export function TimelineStatus({ status }: TimelineStatusProps) {
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

  if (!tourStatuses) return null;

  return (
    <div className="text-sm font-medium text-gray-900">
      {status}
    </div>
  );
}