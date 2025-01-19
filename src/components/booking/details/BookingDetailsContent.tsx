import { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { CollapsibleContent } from "@/components/ui/collapsible";

interface BookingDetailsContentProps {
  booking: Booking;
  isExpanded: boolean;
}

export function BookingDetailsContent({ booking, isExpanded }: BookingDetailsContentProps) {
  const specialItems = booking.special_items || [];

  return (
    <CollapsibleContent className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-sm text-gray-500 mb-2">Expéditeur</h4>
          <p className="font-medium">{booking.sender_name}</p>
          <p className="text-sm text-gray-600">{booking.sender_phone}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-gray-500 mb-2">Destinataire</h4>
          <p className="font-medium">{booking.recipient_name}</p>
          <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
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
        <div>
          <p className="text-sm text-gray-500">Poids</p>
          <p className="font-medium">{booking.weight} kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Numéro de suivi</p>
          <p className="font-medium">{booking.tracking_number}</p>
        </div>
      </div>

      {specialItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Objets spéciaux:</p>
          <div className="flex flex-wrap gap-2">
            {specialItems.map((item: any, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {item.name}
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
    </CollapsibleContent>
  );
}