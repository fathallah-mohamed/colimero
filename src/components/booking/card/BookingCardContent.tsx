import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useBookingStatus } from "@/hooks/useBookingStatus";

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
  
  const { currentStatus, isUpdating, updateStatus } = useBookingStatus(
    booking.id,
    booking.status,
    onStatusChange,
    onUpdate
  );

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
        <BookingStatusBadge status={currentStatus} />
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600">{booking.delivery_city}</p>
        <p className="font-medium">{booking.recipient_name}</p>
        <p className="text-gray-600">{booking.recipient_phone}</p>
      </div>

      {showActions && (
        <div className="mt-4">
          <BookingActions
            status={currentStatus}
            isCollecting={isCollecting}
            onStatusChange={updateStatus}
            onEdit={handleEdit}
            tourStatus={tourStatus}
            isUpdating={isUpdating}
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