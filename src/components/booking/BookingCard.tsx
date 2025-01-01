import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { BookingHeader } from "./card/BookingHeader";
import { BookingDetails } from "./card/BookingDetails";
import { BookingActions } from "./actions/BookingActions";
import { EditBookingDialog } from "./EditBookingDialog";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { BookingStatus } from "@/types/booking";

interface BookingCardProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => void;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate 
}: BookingCardProps) {
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

      if (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }

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

  const handleEditComplete = () => {
    setShowEditDialog(false);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-start">
        <BookingHeader booking={booking} />
        <BookingStatusBadge status={currentStatus} />
      </div>
      
      <BookingDetails booking={booking} />
      
      <BookingActions
        status={currentStatus}
        isCollecting={isCollecting}
        onStatusChange={updateBookingStatus}
        onEdit={handleEdit}
      />

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditComplete}
      />
    </div>
  );
}