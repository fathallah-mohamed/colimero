import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin } from "lucide-react";

interface BookingHeaderProps {
  booking: any;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">
          Réservation #{booking.tracking_number}
        </h3>
        <p className="text-sm text-gray-500">
          {format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr })}
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        <span>{booking.pickup_city} {booking.delivery_city}</span>
      </div>
    </div>
  );
}