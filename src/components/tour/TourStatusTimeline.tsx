import { CheckCircle2, Circle, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TourStatus = 'planned' | 'collecting' | 'in_transit' | 'completed' | 'cancelled';

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
    return (
      <div className="flex items-center justify-center w-full py-4">
        <div className="flex flex-col items-center">
          <XCircle className="h-8 w-8 text-red-500" />
          <span className="text-sm mt-1 text-red-500 font-medium">Tournée annulée</span>
        </div>
      </div>
    );
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full py-4">
      {statusOrder.map((status, index) => (
        <div key={status} className="flex flex-col items-center relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full p-0 h-8 w-8 transition-colors",
              index <= currentIndex && "hover:bg-gray-100"
            )}
            onClick={() => handleStatusChange(status)}
            disabled={index > currentIndex + 1}
          >
            {index < currentIndex ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : status === currentStatus ? (
              <Circle className="h-6 w-6 text-blue-500" fill="currentColor" />
            ) : status === 'in_transit' ? (
              <Truck className={cn(
                "h-6 w-6",
                index === currentIndex + 1 ? "text-gray-400" : "text-gray-300"
              )} />
            ) : (
              <Circle className={cn(
                "h-6 w-6",
                index === currentIndex + 1 ? "text-gray-400" : "text-gray-300"
              )} />
            )}
          </Button>
          <span className={cn(
            "text-xs mt-1",
            status === currentStatus ? "font-medium text-blue-500" : "text-gray-500"
          )}>
            {status === 'planned' && "Planifiée"}
            {status === 'collecting' && "Collecte"}
            {status === 'in_transit' && "Livraison"}
            {status === 'completed' && "Terminée"}
          </span>
          {index < statusOrder.length - 1 && (
            <div className={cn(
              "absolute top-4 left-8 w-[calc(100%+1rem)] h-[2px]",
              index < currentIndex ? "bg-green-500" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}