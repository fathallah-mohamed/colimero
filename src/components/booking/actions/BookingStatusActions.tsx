import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Edit2, X, Package, Truck, MapPin } from "lucide-react";
import { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface BookingStatusActionsProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  tourStatus: string;
  isCarrier: boolean;
  onStatusChange: () => Promise<void>;
  onEdit: () => void;
}

export function BookingStatusActions({
  bookingId,
  bookingStatus,
  tourStatus,
  isCarrier,
  onStatusChange,
  onEdit,
}: BookingStatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      await onStatusChange();
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    disabled: boolean = false
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={disabled || isLoading}
            className="flex items-center gap-2"
          >
            {icon}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (bookingStatus === "delivered" || bookingStatus === "cancelled") {
    return null;
  }

  const renderButtons = () => {
    if (isCarrier) {
      switch (bookingStatus) {
        case "pending":
          return (
            <>
              {renderActionButton(<Check className="h-4 w-4" />, "Confirmer", 
                () => handleStatusChange("confirmed"))}
              {renderActionButton(<Edit2 className="h-4 w-4" />, "Modifier", onEdit)}
              {renderActionButton(<X className="h-4 w-4" />, "Annuler", 
                () => handleStatusChange("cancelled"))}
            </>
          );
        case "confirmed":
          return (
            <>
              {renderActionButton(<Edit2 className="h-4 w-4" />, "Modifier", onEdit)}
              {renderActionButton(<X className="h-4 w-4" />, "Annuler", 
                () => handleStatusChange("cancelled"))}
              {renderActionButton(<Package className="h-4 w-4" />, "Marquer comme Collecté", 
                () => handleStatusChange("collected"), 
                tourStatus !== "Ramassage en cours")}
            </>
          );
        case "collected":
          return (
            <>
              {renderActionButton(<Edit2 className="h-4 w-4" />, "Modifier", onEdit)}
              {renderActionButton(<Truck className="h-4 w-4" />, "Marquer comme Prêt à Livrer", 
                () => handleStatusChange("ready_to_deliver"), 
                tourStatus !== "En transit")}
            </>
          );
        case "ready_to_deliver":
          return renderActionButton(<MapPin className="h-4 w-4" />, "Marquer comme Livré", 
            () => handleStatusChange("delivered"), 
            tourStatus !== "Livraison en cours");
        default:
          return null;
      }
    } else {
      // Client actions
      if (tourStatus !== "Programmée") {
        return null;
      }
      
      switch (bookingStatus) {
        case "pending":
        case "confirmed":
          return (
            <>
              {renderActionButton(<Edit2 className="h-4 w-4" />, "Modifier", onEdit)}
              {renderActionButton(<X className="h-4 w-4" />, "Annuler", 
                () => handleStatusChange("cancelled"))}
            </>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {renderButtons()}
    </div>
  );
}