import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { BookingHeader } from "./card/BookingHeader";
import { BookingDetails } from "./details/BookingDetails";
import { BookingActions } from "./actions/BookingActions";
import { EditBookingDialog } from "./EditBookingDialog";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
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
  const [showDetails, setShowDetails] = useState(false);
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
      
      {showDetails && <BookingDetails booking={booking} />}
      
      <BookingActions
        status={currentStatus}
        isCollecting={isCollecting}
        onStatusChange={updateBookingStatus}
        onEdit={handleEdit}
      />

      <div className="flex justify-center border-t pt-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center justify-center gap-2 w-full max-w-md hover:bg-gray-50"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Info className="h-4 w-4" />
          {showDetails ? (
            <>
              Masquer les détails de la réservation
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Voir tous les détails de la réservation
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditComplete}
      />
    </div>
  );
}