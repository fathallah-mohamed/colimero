import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
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
      console.log("Updating booking status:", { bookingId, newStatus });
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      await onStatusChange();
      toast({
        title: "Statut mis à jour",
        description: newStatus === 'cancelled' 
          ? "La réservation a été annulée avec succès."
          : "Le statut de la réservation a été mis à jour avec succès.",
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

  if (bookingStatus === "cancelled" || tourStatus !== "Programmée") {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatusChange("cancelled")}
        disabled={isLoading}
        className="flex items-center gap-2 text-red-500 hover:text-red-600"
      >
        <X className="h-4 w-4" />
        Annuler
      </Button>
    </div>
  );
}