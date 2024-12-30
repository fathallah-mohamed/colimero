import { CheckCircle2, Circle, Truck, XCircle, CalendarCheck, PackageSearch, MapPin } from "lucide-react";
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
      <div className="flex items-center justify-center w-full py-6">
        <div className="flex flex-col items-center">
          <XCircle className="h-12 w-12 text-red-500" />
          <span className="text-sm mt-2 text-red-500 font-medium">Tournée annulée</span>
        </div>
      </div>
    );
  }

  const statusOrder: TourStatus[] = ['planned', 'collecting', 'in_transit', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full py-6">
      {statusOrder.map((status, index) => (
        <div key={status} className="flex flex-col items-center relative">
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
            {index < currentIndex ? (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            ) : status === currentStatus ? (
              {
                planned: <CalendarCheck className="h-10 w-10 text-primary" />,
                collecting: <PackageSearch className="h-10 w-10 text-primary" />,
                in_transit: <Truck className="h-10 w-10 text-primary" />,
                completed: <MapPin className="h-10 w-10 text-primary" />
              }[status]
            ) : {
              planned: <CalendarCheck className={cn("h-10 w-10", index === currentIndex + 1 ? "text-gray-400" : "text-gray-300")} />,
              collecting: <PackageSearch className={cn("h-10 w-10", index === currentIndex + 1 ? "text-gray-400" : "text-gray-300")} />,
              in_transit: <Truck className={cn("h-10 w-10", index === currentIndex + 1 ? "text-gray-400" : "text-gray-300")} />,
              completed: <MapPin className={cn("h-10 w-10", index === currentIndex + 1 ? "text-gray-400" : "text-gray-300")} />
            }[status]}
          </Button>
          <span className={cn(
            "text-sm mt-3 font-medium",
            status === currentStatus ? "text-primary" : "text-gray-500"
          )}>
            {status === 'planned' && "Planifiée"}
            {status === 'collecting' && "Collecte"}
            {status === 'in_transit' && "Livraison"}
            {status === 'completed' && "Terminée"}
          </span>
          {index < statusOrder.length - 1 && (
            <div className={cn(
              "absolute top-8 left-16 w-[calc(100%+1rem)] h-[2px]",
              index < currentIndex ? "bg-green-500" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}