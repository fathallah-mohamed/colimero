import { BookingStatusSection } from "../status/BookingStatusSection";
import type { Booking } from "@/types/booking";

interface BookingHeaderSectionProps {
  booking: Booking;
}

export function BookingHeaderSection({ booking }: BookingHeaderSectionProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium">{booking.delivery_city}</h3>
        <div className="text-sm text-gray-600">
          <p>{booking.recipient_name}</p>
          <p>{booking.recipient_phone}</p>
        </div>
      </div>
      <BookingStatusSection booking={booking} />
    </div>
  );
}