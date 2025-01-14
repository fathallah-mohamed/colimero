import { BookingStatusBadge } from "../BookingStatusBadge";
import type { Booking } from "@/types/booking";

interface BookingCardHeaderProps {
  booking: Booking;
}

export function BookingCardHeader({ booking }: BookingCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div>
        <div className="font-medium">#{booking.tracking_number}</div>
        <div className="text-sm text-gray-500">{booking.weight} kg</div>
      </div>
      <BookingStatusBadge status={booking.status} />
    </div>
  );
}