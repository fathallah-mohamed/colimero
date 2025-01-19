import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info } from "lucide-react";
import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingActions } from "./actions/BookingActions";
import { BookingHeader } from "./card/BookingHeader";
import type { Booking, BookingStatus } from "@/types/booking";

interface BookingCardProps {
  booking: Booking;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCard({ booking, isCollecting, onStatusChange, onUpdate, tourStatus }: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const specialItems = booking.special_items || [];

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

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', booking.id);

      if (error) throw error;

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
        <div className="flex flex-col gap-2">
          <BookingHeader booking={booking} />
          <div className="flex justify-end">
            <BookingActions
              status={booking.status}
              isCollecting={isCollecting}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              tourStatus={tourStatus}
            />
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
              <Info className="h-4 w-4" />
              {isExpanded ? "Masquer les détails" : "Voir les détails"}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Expéditeur</h4>
                <p className="font-medium">{booking.sender_name}</p>
                <p className="text-sm text-gray-600">{booking.sender_phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Destinataire</h4>
                <p className="font-medium">{booking.recipient_name}</p>
                <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
                <p className="text-sm text-gray-600">{booking.recipient_address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ville de collecte</p>
                <p className="font-medium">{booking.pickup_city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ville de livraison</p>
                <p className="font-medium">{booking.delivery_city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Poids</p>
                <p className="font-medium">{booking.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Numéro de suivi</p>
                <p className="font-medium">{booking.tracking_number}</p>
              </div>
            </div>

            {specialItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Objets spéciaux:</p>
                <div className="flex flex-wrap gap-2">
                  {specialItems.map((item: any, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {booking.package_description && (
              <div>
                <p className="text-sm text-gray-500">Description du colis</p>
                <p className="text-sm">{booking.package_description}</p>
              </div>
            )}
          </CollapsibleContent>
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
