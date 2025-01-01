import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import { BookingInfo } from "./BookingInfo";
import { useBookingStatus } from "../hooks/useBookingStatus";
import type { BookingStatus } from "@/types/booking";

interface BookingCardContentProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus
}: BookingCardContentProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { isUpdating, updateStatus } = useBookingStatus(booking.id, onStatusChange, onUpdate);

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", booking.id);
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    console.log("Edit successful, updating booking list");
    await onUpdate();
    setShowEditDialog(false);
  };

  const showActions = isCollecting || tourStatus === 'planned';

  return (
    <>
      <div className="flex justify-between items-start">
        <BookingHeader booking={booking} />
        <BookingStatusBadge status={booking.status} />
      </div>
      
      <BookingInfo 
        delivery_city={booking.delivery_city}
        recipient_name={booking.recipient_name}
        recipient_phone={booking.recipient_phone}
      />

      {showActions && (
        <div className="mt-4">
          <BookingActions
            status={booking.status}
            isCollecting={isCollecting}
            onStatusChange={updateStatus}
            onEdit={handleEdit}
            tourStatus={tourStatus}
          />
        </div>
      )}

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}