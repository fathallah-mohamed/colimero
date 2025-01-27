import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "../actions/CancelConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BookingActionProps } from "./types";
import { useState } from "react";
import { DuplicateBookingDialog } from "./DuplicateBookingDialog";

export function BookingActions({ 
  bookingId,
  status, 
  tourStatus,
  onStatusChange, 
  onUpdate,
  onEdit,
  userType,
  tourId,
  userId
}: BookingActionProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  console.log("BookingActions - Props:", { bookingId, status, tourStatus, userType });

  const checkExistingPendingBooking = async (userId: string, tourId: number) => {
    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('tour_id', tourId)
      .eq('status', 'pending')
      .maybeSingle();

    if (error) {
      console.error('Error checking existing booking:', error);
      return false;
    }

    return existingBooking !== null;
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log('BookingActions - Changing status to:', newStatus);
      
      if (newStatus === 'pending') {
        const hasExistingPending = await checkExistingPendingBooking(userId, tourId);
        if (hasExistingPending) {
          setShowDuplicateDialog(true);
          return;
        }
      }

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
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
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

      <DuplicateBookingDialog 
        isOpen={showDuplicateDialog} 
        onClose={() => setShowDuplicateDialog(false)} 
      />
    </div>
  );
}