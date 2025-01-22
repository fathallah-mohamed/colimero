import { BookingStatus } from "@/types/booking";
import { ClientBookingActions } from "./actions/ClientBookingActions";
import { CarrierBookingActions } from "./actions/CarrierBookingActions";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType: string;
}

export function BookingActions({ 
  bookingId,
  status, 
  tourStatus,
  onStatusChange, 
  onUpdate,
  onEdit,
  userType
}: BookingActionsProps) {
  const handleStatusChange = async (newStatus: BookingStatus) => {
    console.log('Changing status to:', newStatus);
    await onStatusChange(bookingId, newStatus);
    await onUpdate();
  };

  if (userType === "carrier") {
    return (
      <CarrierBookingActions
        status={status}
        tourStatus={tourStatus}
        onStatusChange={handleStatusChange}
        onEdit={onEdit}
      />
    );
  }

  return (
    <ClientBookingActions
      status={status}
      tourStatus={tourStatus}
      onStatusChange={handleStatusChange}
      onEdit={onEdit}
    />
  );
}