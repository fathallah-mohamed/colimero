import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActionButton } from "./ActionButton";
import { CancelConfirmDialog } from "./CancelConfirmDialog";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onEdit: () => void;
  bookingId: string;
  tourStatus?: string;
  onUpdate: () => Promise<void>;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit,
  bookingId,
  tourStatus,
  onUpdate
}: BookingActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  if (!isCollecting) return null;

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log('Changing status to:', newStatus);

      if (newStatus === 'cancelled') {
        const { error } = await supabase.rpc('cancel_booking_and_update_capacity', {
          booking_id: bookingId
        });

        if (error) throw error;
      }

      // Invalider les caches pour forcer le rechargement
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['next-tour'] });
      await queryClient.invalidateQueries({ queryKey: ['tours'] });

      // Appeler les callbacks pour mettre à jour l'UI
      await onStatusChange(bookingId, newStatus);
      await onUpdate();

      const actionLabel = {
        cancelled: "annulée",
        collected: "ramassée",
        pending: "remise en attente"
      }[newStatus];

      toast({
        title: `Réservation ${actionLabel}`,
        description: `La réservation a été ${actionLabel} avec succès.`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <ActionButton
        icon={Edit2}
        label="Modifier"
        onClick={onEdit}
      />

      {status === "cancelled" && (
        <ActionButton
          icon={RotateCcw}
          label="Remettre en attente"
          onClick={() => handleStatusChange("pending")}
          colorClass="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
        />
      )}

      {status === "pending" && tourStatus === "Programmée" && (
        <>
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
          <ActionButton
            icon={CheckSquare}
            label="Marquer comme ramassée"
            onClick={() => handleStatusChange("collected")}
            colorClass="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
          />
        </>
      )}
    </div>
  );
}