import { Booking } from "@/types/booking";

interface BookingCardDetailsProps {
  booking: Booking;
}

export function BookingCardDetails({ booking }: BookingCardDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Expéditeur</h4>
          <p className="font-medium">{booking.sender_name}</p>
          <p className="text-sm text-gray-600">{booking.sender_phone}</p>
          <p className="text-sm text-gray-600">{booking.sender_email}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Destinataire</h4>
          <p className="font-medium">{booking.recipient_name}</p>
          <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
          {booking.recipient_email && (
            <p className="text-sm text-gray-600">{booking.recipient_email}</p>
          )}
          <p className="text-sm text-gray-600">{booking.recipient_address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Ville de collecte</p>
          <p className="font-medium">{booking.pickup_city}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ville de livraison</p>
          <p className="font-medium">{booking.delivery_city}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Poids</p>
          <p className="font-medium">{booking.weight} kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Numéro de suivi</p>
          <p className="font-medium">{booking.tracking_number}</p>
        </div>
      </div>

      {booking.special_items && booking.special_items.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
          <div className="flex flex-wrap gap-2">
            {booking.special_items.map((item: any, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {item.name} {item.quantity > 1 && `(${item.quantity})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {booking.package_description && (
        <div>
          <p className="text-sm text-gray-500">Description du colis</p>
          <p className="text-sm">{booking.package_description}</p>
        </div>
      )}
    </div>
  );
}