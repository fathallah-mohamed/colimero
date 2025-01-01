import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info } from "lucide-react";
import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingStatus } from "@/types/booking";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingActions } from "./BookingActions";

interface BookingCardProps {
  booking: Booking;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onUpdate: () => void;
}

export function BookingCard({ booking, isCollecting, onStatusChange, onUpdate }: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const specialItems = booking.special_items || [];

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      onStatusChange(booking.id, newStatus);
      toast({
        title: "Statut mis à jour",
        description: `La réservation a été marquée comme ${
          newStatus === 'collected' ? 'collectée' : 
          newStatus === 'cancelled' ? 'annulée' : 
          'en attente'
        }`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{booking.recipient_name}</h3>
        <div className="flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <BookingActions
            status={booking.status}
            isCollecting={isCollecting}
            onStatusChange={handleStatusChange}
            onEdit={() => setShowEditDialog(true)}
          />
        </div>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
            <Info className="h-4 w-4" />
            Voir les détails
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
                  <BookingStatusBadge key={index} status={item.name} />
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </Card>
  );
}