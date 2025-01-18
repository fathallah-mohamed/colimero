import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingAddressInfo } from "./card/BookingAddressInfo";
import { BookingActions } from "./card/BookingActions";
import { useNavigation } from "@/hooks/use-navigation";
import { TourPreview } from "./card/TourPreview";
import { BookingCardContent } from "./card/BookingCardContent";
import { useBookingCard } from "@/hooks/useBookingCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";

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
  const createdAt = booking.created_at ? format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr }) : "Date inconnue";

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <BookingCardHeader booking={booking} />

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Réservé le {createdAt}</span>
        </div>

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

        <BookingCardContent
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          booking={booking}
          tours={booking.tours}
        />

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