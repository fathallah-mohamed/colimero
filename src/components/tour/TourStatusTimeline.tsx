import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "../../types/tour";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { TimelineButton } from "./timeline/TimelineButton";
import { getStatusLabel } from "./timeline/timelineUtils";

interface TourStatusTimelineProps {
  tourId: number;
  currentStatus: TourStatus;
  onStatusChange: (newStatus: TourStatus) => void;
}

export function TourStatusTimeline({ tourId, currentStatus, onStatusChange }: TourStatusTimelineProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: TourStatus) => {
    try {
      // Cas 1: De "collecting" à "planned"
      if (currentStatus === 'collecting' && newStatus === 'planned') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        // Les réservations avec statut "collected" restent "collected"
        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'pending' })
          .eq('tour_id', tourId)
          .eq('status', 'pending');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations collectées restent inchangées.",
        });
      }
      // Cas 2: De "collecting" à "in_transit"
      else if (currentStatus === 'collecting' && newStatus === 'in_transit') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'in_transit' })
          .eq('tour_id', tourId)
          .eq('status', 'collected');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée et des réservations collectées ont été mis à jour avec succès.",
        });
      }
      // Cas 3: De "in_transit" à "collecting"
      else if (currentStatus === 'in_transit' && newStatus === 'collecting') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'collected' })
          .eq('tour_id', tourId)
          .eq('status', 'in_transit');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée a été mis à jour. Les réservations en transit sont maintenant marquées comme collectées.",
        });
      }
      // Comportement normal pour les autres changements de statut
      else {
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
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tournée.",
      });
    }
  };

  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center justify-center w-full py-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <span className="text-sm font-medium text-red-500">Tournée annulée</span>
        </div>
      </div>
    );
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="relative flex justify-between items-center">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={status} className="flex flex-col items-center relative z-10">
              <TimelineButton
                status={status}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                onClick={() => handleStatusChange(status)}
                disabled={index > currentIndex + 1}
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
        
        {/* Progress bar */}
        <div className="absolute top-8 left-0 h-0.5 bg-gray-200 w-full -z-10" />
        <div 
          className="absolute top-8 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
          style={{ 
            width: `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
          }} 
        />
      </div>
    </div>
  );
}