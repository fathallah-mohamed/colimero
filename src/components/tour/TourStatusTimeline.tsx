import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "../../types/tour";
import { TimelineStatus } from "./timeline/TimelineStatus";
import { CancelledStatus } from "./timeline/CancelledStatus";
import { cn } from "@/lib/utils";

interface TourStatusTimelineProps {
  tourId: number;
  currentStatus: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, currentStatus, onStatusChange }: TourStatusTimelineProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: TourStatus) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tourId);

      if (error) throw error;

      onStatusChange(newStatus);
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tournée a été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    }
  };

  if (currentStatus === 'cancelled') {
    return <CancelledStatus />;
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full py-6">
      {statusOrder.map((status, index) => (
        <div key={status} className="relative flex-1 last:flex-none">
          <TimelineStatus
            status={status}
            currentStatus={currentStatus}
            currentIndex={currentIndex}
            index={index}
            onClick={() => handleStatusChange(status)}
          />
          {index < statusOrder.length - 1 && (
            <div className={cn(
              "absolute top-8 left-16 w-[calc(100%+1rem)] h-[2px]",
              index < currentIndex || index === currentIndex ? "bg-green-500" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}