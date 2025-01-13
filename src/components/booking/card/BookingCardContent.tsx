import { useState } from "react";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./BookingCardDetails";
import { Card } from "@/components/ui/card";
import { MapPin, User, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";

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

  const handleStatusChange = async (newStatus: BookingStatus) => {
    await onStatusChange(booking.id, newStatus);
    await onUpdate();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* En-tête de la réservation */}
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

            {booking.tours?.departure_date && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="text-sm">Départ prévu</p>
                  <p className="font-medium">{booking.departure_date_formatted}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <BookingStatusBadge status={booking.status} />
            <BookingActions
              status={booking.status}
              isCollecting={isCollecting}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              bookingId={booking.id}
              tourStatus={tourStatus}
            />
          </div>
        </div>

        {/* Itinéraire de la tournée */}
        {booking.tours?.route && (
          <div className="mt-4 border-t pt-4">
            <TourRoute tour={booking.tours} />
          </div>
        )}

        {/* Bouton pour afficher/masquer les détails */}
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

        {/* Détails de la réservation (affichés uniquement si showDetails est true) */}
        {showDetails && <BookingCardDetails booking={booking} />}

        {/* Dialog de modification */}
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