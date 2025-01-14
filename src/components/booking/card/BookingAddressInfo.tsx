import type { Booking } from "@/types/booking";

interface BookingAddressInfoProps {
  booking: Booking;
}

export function BookingAddressInfo({ booking }: BookingAddressInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-sm text-gray-500">Expéditeur</div>
        <div className="text-sm font-medium">{booking.sender_name}</div>
        <div className="text-sm text-gray-600">{booking.pickup_city}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Destinataire</div>
        <div className="text-sm font-medium">{booking.recipient_name}</div>
        <div className="text-sm text-gray-600">{booking.delivery_city}</div>
      </div>
    </div>
  );
}