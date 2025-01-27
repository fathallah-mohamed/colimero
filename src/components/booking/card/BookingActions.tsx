import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "../actions/CancelConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { StatusChangeButton } from "./StatusChangeButton";
import { BookingActionProps } from "./types";

export function BookingActions({ 
  bookingId,
  status, 
  tourStatus,
  onStatusChange, 
  onUpdate,
  onEdit,
  userType
}: BookingActionProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log('BookingActions - Changing status to:', newStatus);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      await onStatusChange(newStatus);
      await onUpdate();

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

  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  // Actions pour les clients
  if (userType === 'client') {
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

        {status === "pending" && (
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
        )}
      </div>
    );
  }

  // Actions pour les transporteurs
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
        <StatusChangeButton
          onClick={() => handleStatusChange("pending")}
          icon={<RotateCcw className="h-4 w-4" />}
          label="Remettre en attente"
          className="text-blue-500 hover:text-blue-600"
        />
      )}

      {status === "pending" && (
        <>
          {tourStatus === "Programmée" && (
            <>
              <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
              <StatusChangeButton
                onClick={() => handleStatusChange("confirmed")}
                icon={<CheckSquare className="h-4 w-4" />}
                label="Confirmer"
                className="text-green-500 hover:text-green-600"
              />
            </>
          )}
          {tourStatus === "Ramassage en cours" && (
            <>
              <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
              <StatusChangeButton
                onClick={() => handleStatusChange("collected")}
                icon={<CheckSquare className="h-4 w-4" />}
                label="Marquer comme collectée"
                className="text-green-500 hover:text-green-600"
              />
            </>
          )}
        </>
      )}

      {status === "confirmed" && (
        <>
          {tourStatus === "Programmée" && (
            <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
          )}
          {tourStatus === "Ramassage en cours" && (
            <>
              <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
              <StatusChangeButton
                onClick={() => handleStatusChange("collected")}
                icon={<CheckSquare className="h-4 w-4" />}
                label="Marquer comme collectée"
                className="text-green-500 hover:text-green-600"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}