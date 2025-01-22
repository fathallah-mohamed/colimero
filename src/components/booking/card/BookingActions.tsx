import { BookingStatus } from "@/types/booking";
import { ClientBookingActions } from "./actions/ClientBookingActions";
import { CarrierBookingActions } from "./actions/CarrierBookingActions";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
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
    try {
      console.log('BookingActions - Changing status to:', newStatus);
      await onStatusChange(bookingId, newStatus);
      await onUpdate();
    } catch (error) {
      console.error('BookingActions - Error changing status:', error);
      throw error; // Propager l'erreur pour la gestion en amont
    }
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