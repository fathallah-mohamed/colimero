import { MapPin } from "lucide-react";
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>De {booking.pickup_city} vers {booking.delivery_city}</span>
        </div>
      </div>
      <BookingStatusBadge status={booking.status} />
    </div>
  );
}