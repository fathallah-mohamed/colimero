import { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarrierActions } from "./actions/CarrierActions";
import { ClientActions } from "./actions/ClientActions";

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
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Invalider immédiatement le cache
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

  return (
    <div className="flex items-center gap-2">
      {userType === "carrier" ? (
        <CarrierActions
          status={status}
          tourStatus={tourStatus}
          onStatusChange={handleStatusChange}
          onEdit={onEdit}
        />
      ) : (
        <ClientActions
          status={status}
          tourStatus={tourStatus}
          onStatusChange={handleStatusChange}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}