import { useState } from "react";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingStatusActions } from "../actions/BookingStatusActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./BookingCardDetails";
import { Card } from "@/components/ui/card";
import { MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardContentProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
  isCarrier?: boolean;
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus = "Programmée",
  isCarrier = false
}: BookingCardContentProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    await onUpdate();
    setShowEditDialog(false);
    toast({
      title: "Réservation mise à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  const handleStatusChange = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      await onUpdate();
      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès.",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
      });
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h3 className="text-lg font-medium">
                Réservation #{booking.tracking_number}
              </h3>
              <p className="text-sm text-gray-500">{booking.created_at_formatted}</p>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{booking.delivery_city}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <div>
                <p className="font-medium">{booking.recipient_name}</p>
                <p className="text-sm">{booking.recipient_phone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <BookingStatusBadge status={booking.status} />
            {tourStatus === "Programmée" && booking.status !== "cancelled" && (
              <BookingStatusActions
                bookingId={booking.id}
                bookingStatus={booking.status}
                tourStatus={tourStatus}
                isCarrier={isCarrier}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              Masquer les détails
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Voir tous les détails de la réservation
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {showDetails && <BookingCardDetails booking={booking} />}

        <EditBookingDialog
          booking={booking}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      </div>
    </Card>
  );
}