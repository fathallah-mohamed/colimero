import { MapPin, User, Calendar } from "lucide-react";

interface BookingHeaderProps {
  booking: any;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div>
          <h3 className="text-lg font-medium">
            Réservation #{booking.tracking_number}
          </h3>
          <p className="text-sm text-gray-500">{booking.created_at_formatted}</p>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{booking.delivery_city}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <User className="h-4 w-4" />
          <div>
            <p className="font-medium">{booking.recipient_name}</p>
            <p className="text-sm">{booking.recipient_phone}</p>
          </div>
        </div>

        {booking.tours?.departure_date && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="text-sm">Départ prévu</p>
              <p className="font-medium">{booking.departure_date_formatted}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}