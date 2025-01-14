import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./card/BookingCardDetails";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingAddressInfo } from "./card/BookingAddressInfo";
import { BookingActions } from "./card/BookingActions";
import { useNavigation } from "@/hooks/use-navigation";
import { TourPreview } from "./card/TourPreview";
import { TourDetails } from "./card/TourDetails";

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
  tourStatus
}: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { userType } = useNavigation();

  // Récupérer le statut de la tournée depuis l'objet booking
  const currentTourStatus = booking.tours?.status || tourStatus || "Programmée";

  const handleEditSuccess = async () => {
    await onUpdate();
    setShowEditDialog(false);
    toast({
      title: "Réservation mise à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <BookingCardHeader booking={booking} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Détails de la livraison</h4>
            <BookingAddressInfo booking={booking} />
          </div>

          {booking.tours && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Aperçu de la tournée</h4>
              <TourPreview tour={booking.tours} />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            tourStatus={currentTourStatus}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onEdit={() => setShowEditDialog(true)}
            userType={userType}
          />
        </div>

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

        {showDetails && (
          <div className="space-y-6">
            {booking.tours && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Détails de la tournée</h4>
                <TourDetails tour={booking.tours} />
              </div>
            )}
            <BookingCardDetails booking={booking} />
          </div>
        )}

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