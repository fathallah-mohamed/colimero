import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions as BookingActionsButtons } from "../actions/BookingActions";
import type { BookingStatus } from "@/types/booking";

interface BookingActionsProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onEdit: () => void;
  tourStatus?: string;
}

export function BookingActions({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onEdit,
  tourStatus 
}: BookingActionsProps) {
  const handleStatusChange = (newStatus: BookingStatus) => {
    onStatusChange(booking.id, newStatus);
  };

  return (
    <div className="flex items-center space-x-4">
      <BookingStatusBadge status={booking.status} />
      <BookingActionsButtons
        status={booking.status}
        isCollecting={isCollecting}
        onStatusChange={handleStatusChange}
        onEdit={onEdit}
        bookingId={booking.id}
        tourStatus={tourStatus}
      />
    </div>
  );
}