import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye } from "lucide-react";
import { BookingStatus } from "@/types/booking";
import { BookingActions } from "../tour/booking/BookingActions";
import { useState } from "react";
import { BookingHeader } from "./header/BookingHeader";
import { BookingDetails } from "./details/BookingDetails";

interface BookingCardProps {
  booking: any;
  isCollecting?: boolean;
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

export function BookingCard({ booking, isCollecting = false, onStatusChange, onUpdate }: BookingCardProps) {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);

  const handleCancel = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      setCurrentStatus('cancelled');
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
      
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
      });
    }
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log("BookingCard - Changing status to:", newStatus);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      
      if (onStatusChange) {
        await onStatusChange(booking.id, newStatus);
      }

      toast({
        title: "Statut mis à jour",
        description: `La réservation a été mise à jour avec succès`,
      });

      if (onUpdate) {
        await onUpdate();
      }
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
    <div className="bg-white shadow rounded-lg p-6">
      <BookingHeader booking={booking} />

      {showDetails && <BookingDetails booking={booking} />}

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? "Masquer les détails" : "Voir les détails"}
          </Button>

          <div className="flex items-center gap-2">
            {isCollecting ? (
              <BookingActions
                status={currentStatus}
                isCollecting={isCollecting}
                onStatusChange={handleStatusChange}
                onEdit={() => {}}
              />
            ) : currentStatus === 'pending' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Êtes-vous sûr de vouloir annuler cette réservation ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-red-500 hover:bg-red-600">
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}