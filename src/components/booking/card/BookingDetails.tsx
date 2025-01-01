interface BookingDetailsProps {
  booking: any;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Destinataire</p>
        <p className="font-medium">{booking.recipient_name}</p>
        <p className="text-gray-600">{booking.recipient_phone}</p>
        <p className="text-gray-600">{booking.recipient_address}</p>
      </div>
      <div>
        <p className="text-gray-500">Détails du colis</p>
        <p className="font-medium">{booking.weight} kg</p>
        <p className="text-gray-600">{booking.item_type}</p>
        {booking.package_description && (
          <p className="text-gray-600">{booking.package_description}</p>
        )}
      </div>
    </div>
  );
}