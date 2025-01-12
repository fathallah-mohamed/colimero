import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Phone, User, Scale, Calendar, Clock, Truck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingCardDetails } from "./BookingCardDetails";

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
  const { toast } = useToast();

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status to:", newStatus, "for booking:", booking.id);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
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

  const canModifyBooking = booking.tours?.status === "Programmée";

  return (
    <>
      <div className="flex justify-between items-start">
        <BookingHeader booking={booking} />
        <BookingStatusBadge status={currentStatus} />
      </div>

      <BookingCardDetails booking={booking} />

      {canModifyBooking && (
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