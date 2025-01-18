import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";
import { useBookingCard } from "@/hooks/useBookingCard";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { ChevronDown, ChevronUp, Edit2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
  isCollecting?: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  isEven?: boolean;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting = false, 
  onStatusChange,
  onUpdate,
  tourStatus
}: BookingCardProps) {
  const { userType } = useNavigation();
  const {
    showEditDialog,
    setShowEditDialog,
    showDetails,
    setShowDetails,
    handleEditSuccess
  } = useBookingCard(onStatusChange, onUpdate);

  const currentTourStatus = booking.tours?.status || tourStatus || "Programmée";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200 space-y-4">
      {/* En-tête avec statut et numéro de réservation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <BookingStatusBadge status={booking.status} />
          <div className="text-sm text-gray-600">
            Réservation #{booking.tracking_number}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr })}
        </div>
      </div>

      {/* Informations clés */}
      <div className="text-sm text-gray-600 flex items-center gap-4">
        <span>{booking.weight} kg</span>
        <span>•</span>
        <span>Collecte : {booking.pickup_city}</span>
        <span>•</span>
        <span>Livraison : {booking.delivery_city}</span>
      </div>

      {/* Détails principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Expéditeur</h4>
          <p className="font-medium">{booking.sender_name}</p>
          <p className="text-sm text-gray-600">{booking.sender_phone}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Destinataire</h4>
          <p className="font-medium">{booking.recipient_name}</p>
          <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
        </div>
      </div>

      {/* Aperçu de la tournée */}
      {booking.tours && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Aperçu de la tournée</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Transporteur : {booking.tours.carriers?.company_name}
              </p>
              <p className="text-sm text-gray-600">
                Contact : {booking.tours.carriers?.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Collecte : {format(new Date(booking.tours.collection_date), "d MMM", { locale: fr })}
              </p>
              <p className="text-sm text-gray-600">
                Départ : {format(new Date(booking.tours.departure_date), "d MMM", { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {booking.status !== "cancelled" && tourStatus === "Programmée" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
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
                  <AlertDialogCancel>Retour</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onStatusChange(booking.id, "cancelled")}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Confirmer l'annulation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Bouton pour afficher/masquer les détails */}
      <Button
        variant="ghost"
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
            Voir les détails
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Détails avancés */}
      {showDetails && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Adresse de livraison</p>
              <p className="text-sm">{booking.recipient_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description du colis</p>
              <p className="text-sm">{booking.package_description}</p>
            </div>
          </div>

          {booking.special_items && booking.special_items.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
              <div className="flex flex-wrap gap-2">
                {booking.special_items.map((item: any, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {item.name} {item.quantity > 1 && `(${item.quantity})`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}