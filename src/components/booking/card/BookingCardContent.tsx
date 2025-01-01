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
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate 
}: BookingCardContentProps) {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status to:", newStatus, "for booking:", booking.id);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', booking.id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      onStatusChange(booking.id, newStatus);
      
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
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

      {isCollecting && (
        <div className="mt-4">
          <BookingActions
            status={currentStatus}
            isCollecting={isCollecting}
            onStatusChange={updateBookingStatus}
            onEdit={handleEdit}
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