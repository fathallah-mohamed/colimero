import { useState } from "react";
import { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarrierActions } from "./CarrierActions";
import { ClientActions } from "./ClientActions";

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

  if (bookingStatus === "delivered" || bookingStatus === "cancelled") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {isCarrier ? (
        <CarrierActions
          bookingStatus={bookingStatus}
          tourStatus={tourStatus}
          onStatusChange={handleStatusChange}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      ) : (
        <ClientActions
          bookingStatus={bookingStatus}
          onStatusChange={handleStatusChange}
          onEdit={onEdit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}