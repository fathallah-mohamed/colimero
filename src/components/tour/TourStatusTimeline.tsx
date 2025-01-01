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
      // Cas 1: De "collecting" à "planned"
      if (currentStatus === 'collecting' && newStatus === 'planned') {
        const { error: tourError } = await supabase
          .from('tours')
          .update({ status: newStatus })
          .eq('id', tourId);

        if (tourError) throw tourError;

        const { error: bookingsError } = await supabase
          .from('bookings')
          .update({ status: 'pending' })
          .eq('tour_id', tourId)
          .neq('status', 'cancelled');

        if (bookingsError) throw bookingsError;

        onStatusChange(newStatus);
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la tournée et des réservations ont été mis à jour avec succès.",
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
          description: "Le statut de la tournée et des réservations en transit ont été mis à jour avec succès.",
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

  const getIcon = (status: TourStatus) => {
    switch (status) {
      case "planned":
        return <CalendarCheck className="h-6 w-6" />;
      case "collecting":
        return <PackageSearch className="h-6 w-6" />;
      case "in_transit":
        return <Truck className="h-6 w-6" />;
      case "completed":
        return <MapPin className="h-6 w-6" />;
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
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="relative flex justify-between items-center">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={status} className="flex flex-col items-center relative z-10">
              <Button
                variant="ghost"
                onClick={() => handleStatusChange(status)}
                disabled={index > currentIndex + 1}
                className={cn(
                  "w-16 h-16 rounded-full p-0 relative transition-all duration-300",
                  isCompleted && "bg-primary hover:bg-primary/90",
                  isCurrent && "ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-gray-100 hover:bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute inset-0 rounded-full transition-transform duration-500",
                  isCompleted && "scale-100",
                  !isCompleted && "scale-0"
                )}>
                  {isCompleted && !isCurrent && (
                    <CheckCircle2 className="h-6 w-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  isCompleted && !isCurrent && "opacity-0",
                  (isCurrent || !isCompleted) && "opacity-100"
                )}>
                  <div className={cn(
                    "text-gray-500",
                    isCompleted && "text-white"
                  )}>
                    {getIcon(status)}
                  </div>
                </div>
              </Button>
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
