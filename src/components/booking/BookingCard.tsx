import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./card/BookingCardDetails";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Edit2, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { supabase } from "@/integrations/supabase/client";
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

interface BookingCardProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  isEven?: boolean;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus = "Programmée"
}: BookingCardProps) {
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

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', booking.id);

      if (error) throw error;

      await onStatusChange(booking.id, newStatus);
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

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* En-tête avec les informations essentielles */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div>
                <div className="font-medium">#{booking.tracking_number}</div>
                <div className="text-sm text-gray-500">{booking.weight} kg</div>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Expéditeur</div>
                <div className="text-sm font-medium">{booking.sender_name}</div>
                <div className="text-sm text-gray-600">{booking.pickup_city}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Destinataire</div>
                <div className="text-sm font-medium">{booking.recipient_name}</div>
                <div className="text-sm text-gray-600">{booking.delivery_city}</div>
              </div>
            </div>
          </div>
          
          {tourStatus === "Programmée" && (
            <div className="flex items-center gap-2">
              {booking.status === "pending" && (
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
              >
                <Edit2 className="h-4 w-4" />
                Modifier
              </Button>
              
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
            </div>
          )}
        </div>

        {/* Afficher le trajet */}
        {booking.tours?.route && (
          <div className="pt-2 border-t">
            <TourRoute tour={booking.tours} />
          </div>
        )}

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
              Voir tous les détails
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