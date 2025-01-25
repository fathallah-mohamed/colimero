import { BookingStatus } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Edit2, RotateCcw, CheckSquare, XCircle } from "lucide-react";
import { CancelConfirmDialog } from "./CancelConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (newStatus: BookingStatus) => Promise<void>;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType: string;
}

export function BookingActions({ 
  bookingId,
  status, 
  tourStatus,
  onStatusChange, 
  onUpdate,
  onEdit,
  userType
}: BookingActionsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log('BookingActions - Changing status to:', newStatus);
      
      // Update the booking status in the database
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Call the parent's onStatusChange handler
      await onStatusChange(newStatus);
      await onUpdate();

      // Invalidate queries to trigger a refresh
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['tours'] });
      await queryClient.invalidateQueries({ queryKey: ['next-tour'] });

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation.",
      });
    }
  };

  // Don't show actions if tour is not in the right status
  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="gap-2"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600 gap-2"
          onClick={() => handleStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4" />
          Remettre en attente
        </Button>
      )}

      {status === "pending" && (
        <>
          {tourStatus === "Programmée" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 gap-2"
                onClick={() => handleStatusChange("cancelled")}
              >
                <XCircle className="h-4 w-4" />
                Annuler
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-500 hover:text-green-600 gap-2"
                onClick={() => handleStatusChange("confirmed")}
              >
                <CheckSquare className="h-4 w-4" />
                Confirmer
              </Button>
            </>
          )}
          {tourStatus === "Ramassage en cours" && (
            <>
              <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
              <Button
                variant="outline"
                size="sm"
                className="text-green-500 hover:text-green-600 gap-2"
                onClick={() => handleStatusChange("collected")}
              >
                <CheckSquare className="h-4 w-4" />
                Marquer comme collectée
              </Button>
            </>
          )}
        </>
      )}

      {status === "confirmed" && tourStatus === "Ramassage en cours" && (
        <>
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => handleStatusChange("collected")}
          >
            <CheckSquare className="h-4 w-4" />
            Marquer comme collectée
          </Button>
        </>
      )}
    </div>
  );
}