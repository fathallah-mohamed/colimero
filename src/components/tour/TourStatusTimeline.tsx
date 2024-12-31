import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TourStatus } from "../../types/tour";
import { cn } from "@/lib/utils";
import { CalendarCheck, PackageSearch, Truck, MapPin, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
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
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    }

    const iconClass = cn(
      "h-6 w-6",
      status === currentStatus ? "text-white" : "text-gray-400"
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

  const getStatusLabel = (status: TourStatus) => {
    switch (status) {
      case "planned":
        return "Planifiée";
      case "collecting":
        return "Collecte";
      case "in_transit":
        return "Livraison";
      case "completed":
        return "Terminée";
      default:
        return status;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentIndex / (statusOrder.length - 1)) * 100}%` }}
        />

        {/* Points de statut */}
        <div className="relative z-10 flex justify-between">
          {statusOrder.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className="flex flex-col items-center">
                <Button
                  variant={isCurrent ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-full w-12 h-12 mb-2 relative",
                    isCompleted && "bg-green-500",
                    isCurrent && "bg-primary shadow-lg",
                    !isCompleted && !isCurrent && "bg-gray-100"
                  )}
                  onClick={() => handleStatusChange(status)}
                  disabled={index > currentIndex + 1}
                >
                  {getIcon(status, isCompleted)}
                  {index < statusOrder.length - 1 && (
                    <ArrowRight 
                      className={cn(
                        "absolute -right-8 top-1/2 -translate-y-1/2 h-4 w-4",
                        (index < currentIndex) ? "text-green-500" : "text-gray-300"
                      )} 
                    />
                  )}
                </Button>
                <span className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isCurrent ? "text-primary" : "text-gray-500"
                )}>
                  {getStatusLabel(status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}