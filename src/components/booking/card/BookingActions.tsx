import { Button } from "@/components/ui/button";
import type { BookingStatus } from "@/types/booking";
import { Edit2, XCircle, Package } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType?: string | null;
}

export function BookingActions({ 
  bookingId, 
  status, 
  tourStatus,
  onStatusChange,
  onUpdate,
  onEdit,
  userType
}: BookingActionsProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', bookingId);

      if (error) throw error;

      await onStatusChange(bookingId, newStatus);
      await onUpdate();

      const message = newStatus === "cancelled" ? "annulée" : "ramassée";
      toast({
        title: `Réservation ${message}`,
        description: `La réservation a été ${message} avec succès.`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    }
  };

  // Pour les clients, n'autoriser les modifications que si le statut est "pending" et la tournée est "Programmée"
  const canClientModify = userType === "client" && status === "pending" && tourStatus === "Programmée";
  
  // Pour les transporteurs:
  // - Si la tournée est "Programmée": autoriser modification/annulation des réservations en attente
  // - Si la tournée est "Ramassage en cours": autoriser toutes les actions sur les réservations en attente
  const canCarrierModifyInCollection = userType === "carrier" && status === "pending" && tourStatus === "Ramassage en cours";
  const canCarrierModifyInPlanned = userType === "carrier" && status === "pending" && tourStatus === "Programmée";

  if (!canClientModify && !canCarrierModifyInCollection && !canCarrierModifyInPlanned) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Bouton "Marquer comme ramassée" - uniquement pour les transporteurs pendant la phase de ramassage */}
      {canCarrierModifyInCollection && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange("collected")}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
        >
          <Package className="h-4 w-4" />
          Marquer comme ramassée
        </Button>
      )}
      
      {/* Bouton Modifier - si le client peut modifier ou si le transporteur peut modifier */}
      {(canClientModify || canCarrierModifyInCollection || canCarrierModifyInPlanned) && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
        >
          <Edit2 className="h-4 w-4" />
          Modifier
        </Button>
      )}
      
      {/* Bouton Annuler - si le client peut modifier ou si le transporteur peut modifier */}
      {(canClientModify || canCarrierModifyInCollection || canCarrierModifyInPlanned) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Annuler
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-200">Retour</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange("cancelled")}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer l'annulation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}