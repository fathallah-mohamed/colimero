import type { Booking } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingHeaderProps {
  booking: Booking;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-medium">
        Réservation #{booking.tracking_number}
      </h3>
      <p className="text-sm text-gray-500">
        Créée le {format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr })}
      </p>
    </div>
  );
}