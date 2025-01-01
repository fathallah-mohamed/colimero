import { BookingStatusBadge } from "../BookingStatusBadge";
import type { Booking } from "@/types/booking";

interface BookingHeaderProps {
  booking: Booking;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium mb-1">
          Réservation #{booking.tracking_number}
        </h3>
      </div>
      <BookingStatusBadge status={booking.status} />
    </div>
  );
}