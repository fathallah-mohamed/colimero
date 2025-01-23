import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CarrierBookingActionsProps {
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
  bookingId: string;
}

export function CarrierBookingActions({
  status,
  tourStatus,
  onStatusChange,
  onEdit,
  bookingId
}: CarrierBookingActionsProps) {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      console.log('CarrierBookingActions - Changing status to:', newStatus);
      
      // Mettre à jour le statut dans la base de données
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Appeler la fonction de mise à jour du parent
      onStatusChange(newStatus);

      toast({
        title: "Statut mis à jour",
        description: `La réservation a été ${newStatus === 'confirmed' ? 'confirmée' : 
          newStatus === 'cancelled' ? 'annulée' : 
          newStatus === 'collected' ? 'collectée' : 
          'mise à jour'}`
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation"
      });
    }
  };

  // Ne montrer les actions que pour les tournées programmées ou en cours de ramassage
  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600 gap-2"
          onClick={() => handleStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4" />
          Remettre en attente
        </Button>
      )}

      {status === "pending" && tourStatus === "Programmée" && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 gap-2"
            onClick={() => handleStatusChange("cancelled")}
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => handleStatusChange("confirmed")}
          >
            <CheckSquare className="h-4 w-4" />
            Confirmer
          </Button>
        </>
      )}

      {/* Permettre l'annulation pour les réservations confirmées */}
      {status === "confirmed" && ['Programmée', 'Ramassage en cours'].includes(tourStatus) && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 gap-2"
            onClick={() => handleStatusChange("cancelled")}
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </Button>
          {tourStatus === "Ramassage en cours" && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-600 gap-2"
              onClick={() => handleStatusChange("collected")}
            >
              <CheckSquare className="h-4 w-4" />
              Marquer comme collectée
            </Button>
          )}
        </>
      )}
    </div>
  );
}