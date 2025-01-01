import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardContentProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus
}: BookingCardContentProps) {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log("Updating booking status to:", newStatus, "for booking:", booking.id);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      // Vérifier que la mise à jour a bien été effectuée
      const { data: updatedBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('status, delivery_status')
        .eq('id', booking.id)
        .single();

      if (fetchError) throw fetchError;

      if (updatedBooking.status === newStatus) {
        setCurrentStatus(newStatus);
        onStatusChange(booking.id, newStatus);
        
        toast({
          title: "Succès",
          description: "Le statut a été mis à jour",
        });
      } else {
        throw new Error("La mise à jour n'a pas été enregistrée");
      }
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      // Recharger le statut actuel depuis la base de données
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", booking.id);
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    console.log("Edit successful, updating booking list");
    await onUpdate();
    setShowEditDialog(false);
  };

  const showActions = isCollecting || tourStatus === 'planned';

  return (
    <>
      <div className="flex justify-between items-start">
        <BookingHeader booking={booking} />
        <BookingStatusBadge status={currentStatus} />
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600">{booking.delivery_city}</p>
        <p className="font-medium">{booking.recipient_name}</p>
        <p className="text-gray-600">{booking.recipient_phone}</p>
      </div>

      {showActions && (
        <div className="mt-4">
          <BookingActions
            status={currentStatus}
            isCollecting={isCollecting}
            onStatusChange={updateBookingStatus}
            onEdit={handleEdit}
            tourStatus={tourStatus}
          />
        </div>
      )}

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}