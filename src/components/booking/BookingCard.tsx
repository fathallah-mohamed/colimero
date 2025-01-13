import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./card/BookingCardDetails";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Edit2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { BookingHeader } from "./card/BookingHeader";
import { BookingStatusBadge } from "./BookingStatusBadge";
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

  const handleStatusChange = async () => {
    await onStatusChange(booking.id, "cancelled");
    await onUpdate();
    toast({
      title: "Réservation annulée",
      description: "La réservation a été annulée avec succès.",
    });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-medium text-lg mb-1">
                {booking.tracking_number}
              </div>
              <div className="text-sm text-gray-500">
                Créée le {booking.created_at_formatted}
              </div>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          
          {tourStatus === "Programmée" && (
            <div className="flex items-center gap-2">
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
                      onClick={handleStatusChange}
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

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Expéditeur</div>
            <div className="space-y-1">
              <div>{booking.sender_name}</div>
              <div>{booking.sender_phone}</div>
              <div>Ville de collecte: {booking.pickup_city}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Destinataire</div>
            <div className="space-y-1">
              <div>{booking.recipient_name}</div>
              <div>{booking.recipient_phone}</div>
              <div>{booking.recipient_address}</div>
              <div>Ville de livraison: {booking.delivery_city}</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Détails du colis</div>
              <div className="space-y-1">
                <div>Poids: {booking.weight} kg</div>
                <div>Type: {booking.item_type}</div>
              </div>
            </div>
            
            {booking.special_items?.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Articles spéciaux</div>
                <div className="space-y-1">
                  {booking.special_items.map((item: any) => (
                    <div key={item.name}>
                      {item.name} (x{item.quantity || 1})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 mt-4"
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