import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "../../types/tour";
import { cn } from "@/lib/utils";
import { CalendarCheck, PackageSearch, Truck, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center w-full py-6">
        <div className="flex flex-col items-center">
          <XCircle className="h-10 w-10 text-destructive" />
          <span className="text-sm mt-3 font-medium text-destructive">Annulée</span>
        </div>
      </div>
    );
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const getIcon = (status: TourStatus, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="h-10 w-10 text-green-500" />;
    }

    const iconClass = cn(
      "h-10 w-10",
      status === currentStatus ? "text-primary" : "text-gray-300"
    );

    switch (status) {
      case "planned":
        return <CalendarCheck className={iconClass} />;
      case "collecting":
        return <PackageSearch className={iconClass} />;
      case "in_transit":
        return <Truck className={iconClass} />;
      case "completed":
        return <MapPin className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between w-full py-6">
      {statusOrder.map((status, index) => (
        <div key={status} className="relative flex-1 last:flex-none">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "rounded-full p-0 h-16 w-16 transition-all duration-200",
              index <= currentIndex && "hover:bg-gray-100",
              status === currentStatus && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => handleStatusChange(status)}
            disabled={index > currentIndex + 1}
          >
            {getIcon(status, index < currentIndex)}
          </Button>
          <span className={cn(
            "text-sm mt-3 font-medium absolute left-1/2 -translate-x-1/2",
            status === currentStatus ? "text-primary" : "text-gray-500"
          )}>
            {status === 'planned' && "Planifiée"}
            {status === 'collecting' && "Collecte"}
            {status === 'in_transit' && "Livraison"}
            {status === 'completed' && "Terminée"}
          </span>
          {index < statusOrder.length - 1 && (
            <div className={cn(
              "absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px]",
              index < currentIndex || index === currentIndex ? "bg-green-500" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}