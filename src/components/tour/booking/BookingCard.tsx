import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckSquare, XSquare, Info, RotateCcw, Edit } from "lucide-react";
import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, status: string) => void;
  onUpdate: () => void;
}

export function BookingCard({ booking, isCollecting, onStatusChange, onUpdate }: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  const specialItems = booking.special_items || [];
  const isCancelled = booking.status === "cancelled";
  const isPending = booking.status === "pending";

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      onStatusChange(booking.id, newStatus);
      toast({
        title: "Statut mis à jour",
        description: `La réservation a été marquée comme ${newStatus === 'collected' ? 'collectée' : newStatus === 'cancelled' ? 'annulée' : 'en attente'}`,
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
          <Badge 
            variant={booking.status === "collected" ? "default" : 
                    booking.status === "cancelled" ? "destructive" : 
                    "secondary"}
          >
            {booking.status === "collected" ? "Collecté" :
             booking.status === "cancelled" ? "Annulé" :
             "En attente"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
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
                  <Badge key={index} variant="secondary">
                    {item.name} ({item.quantity})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {isCollecting && (
        <div className="flex gap-2 justify-end pt-2 border-t">
          {isCancelled ? (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-500 hover:text-blue-600"
              onClick={() => handleStatusChange("pending")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Remettre en attente
            </Button>
          ) : isPending && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleStatusChange("cancelled")}
              >
                <XSquare className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-500 hover:text-green-600"
                onClick={() => handleStatusChange("collected")}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Marquer comme collecté
              </Button>
            </>
          )}
        </div>
      )}

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </Card>
  );
}