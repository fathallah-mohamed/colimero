import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, Package, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActionButton } from "@/components/shared/ActionButton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType?: string | null;
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log("Changing booking status:", { bookingId, newStatus });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', bookingId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['next-tour'] });
      await queryClient.invalidateQueries({ queryKey: ['tours'] });

      await onStatusChange(bookingId, newStatus);
      await onUpdate();

      const statusLabels: Record<BookingStatus, string> = {
        pending: "en attente",
        confirmed: "confirmée",
        collected: "ramassée",
        ready_to_deliver: "prête à livrer",
        delivered: "livrée",
        cancelled: "annulée",
        in_transit: "en transit"
      };

      toast({
        title: `Réservation ${statusLabels[newStatus]}`,
        description: `La réservation a été ${statusLabels[newStatus]} avec succès.`,
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

  // Pour les clients, n'autoriser les modifications que si le statut est "pending" et la tournée est "Programmée"
  const canClientModify = userType === "client" && status === "pending" && tourStatus === "Programmée";
  
  // Pour les transporteurs
  const canCarrierModifyInCollection = userType === "carrier" && status === "pending" && tourStatus === "Ramassage en cours";
  const canCarrierModifyInPlanned = userType === "carrier" && (status === "pending" || status === "confirmed") && tourStatus === "Programmée";

  if (!canClientModify && !canCarrierModifyInCollection && !canCarrierModifyInPlanned) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {canCarrierModifyInPlanned && status === "pending" && (
        <ActionButton
          icon={ThumbsUp}
          label="Confirmer"
          onClick={() => handleStatusChange("confirmed")}
          colorClass="bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
        />
      )}
      
      {canCarrierModifyInCollection && (
        <ActionButton
          icon={Package}
          label="Marquer comme ramassée"
          onClick={() => handleStatusChange("collected")}
          colorClass="bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
        />
      )}
      
      {(canClientModify || canCarrierModifyInCollection || canCarrierModifyInPlanned) && (
        <ActionButton
          icon={Edit2}
          label="Modifier"
          onClick={onEdit}
          colorClass="bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
        />
      )}
      
      {(canClientModify || canCarrierModifyInCollection || canCarrierModifyInPlanned) && (
        <ConfirmDialog
          title="Confirmer l'annulation"
          description="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée."
          icon={RotateCcw}
          buttonLabel="Annuler"
          buttonColorClass="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          onConfirm={() => handleStatusChange("cancelled")}
        />
      )}
    </div>
  );
}