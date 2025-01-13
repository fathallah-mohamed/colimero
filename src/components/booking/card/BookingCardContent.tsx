import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingStatusActions } from "../actions/BookingStatusActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./BookingCardDetails";
import { Card } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";

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
  tourStatus,
  isCarrier = false
}: BookingCardContentProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
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
          </div>

          <div className="flex items-center space-x-4">
            <BookingStatusBadge status={booking.status} />
            <BookingStatusActions
              bookingId={booking.id}
              bookingStatus={booking.status}
              tourStatus={tourStatus || ""}
              isCarrier={isCarrier}
              onStatusChange={onUpdate}
              onEdit={handleEdit}
            />
          </div>
        </div>

        <BookingCardDetails booking={booking} />

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