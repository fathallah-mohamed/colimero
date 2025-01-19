import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info } from "lucide-react";
import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingActions } from "./card/BookingActions";
import { BookingHeaderSection } from "./header/BookingHeaderSection";
import { BookingDetailsContent } from "./details/BookingDetailsContent";
import { BookingStatusSection } from "./status/BookingStatusSection";
import type { Booking, BookingStatus } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange, 
  onUpdate, 
  tourStatus 
}: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const checkPendingBooking = async (userId: string, tourId: number) => {
    const { data: existingBookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('tour_id', tourId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error checking pending bookings:', error);
      return true;
    }

    return existingBookings && existingBookings.length > 0;
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status:", { bookingId: booking.id, newStatus });
      
      if (newStatus === 'pending') {
        const hasPendingBooking = await checkPendingBooking(booking.user_id, booking.tour_id);
        if (hasPendingBooking) {
          toast({
            variant: "destructive",
            title: "Action impossible",
            description: "Ce client a déjà une réservation en attente pour cette tournée.",
          });
          return;
        }
      }

      onStatusChange(booking.id, newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: `La réservation a été marquée comme ${
          newStatus === 'collected' ? 'collectée' : 
          newStatus === 'cancelled' ? 'annulée' : 
          newStatus === 'confirmed' ? 'confirmée' :
          'en attente'
        }`,
      });
      
      await onUpdate();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    }
  };

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", booking.id);
    setShowEditDialog(true);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <BookingHeaderSection booking={booking} />
          <BookingStatusSection booking={booking} />
        </div>
        
        <div className="flex justify-end">
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            tourStatus={tourStatus || ''}
            onStatusChange={handleStatusChange}
            onUpdate={onUpdate}
            onEdit={handleEdit}
            userType="carrier"
          />
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
              <Info className="h-4 w-4" />
              {isExpanded ? "Masquer les détails" : "Voir les détails"}
            </Button>
          </CollapsibleTrigger>

          <BookingDetailsContent booking={booking} isExpanded={isExpanded} />
        </Collapsible>
      </div>

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </Card>
  );
}