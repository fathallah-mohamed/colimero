import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingStatusActions } from "../actions/BookingStatusActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./BookingCardDetails";
import { Card } from "@/components/ui/card";

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
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <BookingHeader booking={booking} />
          <BookingStatusBadge status={booking.status} />
        </div>

        <BookingCardDetails booking={booking} />

        <div className="pt-4 border-t">
          <BookingStatusActions
            bookingId={booking.id}
            bookingStatus={booking.status}
            tourStatus={tourStatus || ""}
            isCarrier={isCarrier}
            onStatusChange={onUpdate}
            onEdit={handleEdit}
          />
        </div>

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