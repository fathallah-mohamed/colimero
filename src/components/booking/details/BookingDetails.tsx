import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SpecialItemDisplay } from "../form/SpecialItemDisplay";

interface BookingDetailsProps {
  booking: any;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Expéditeur</p>
          <p className="font-medium">{booking.sender_name}</p>
          <p className="text-sm text-gray-500">{booking.sender_phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ville de collecte</p>
          <p className="font-medium">{booking.pickup_city}</p>
        </div>
      </div>

      {booking.special_items && booking.special_items.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
          <div className="flex flex-wrap gap-2">
            {booking.special_items.map((item: any, index: number) => (
              <SpecialItemDisplay key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {booking.content_types && booking.content_types.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Types de contenu</p>
          <div className="flex flex-wrap gap-2">
            {booking.content_types.map((type: string, index: number) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-500">Date de départ</p>
        <p className="font-medium">
          {format(new Date(booking.tours?.departure_date), "d MMMM yyyy", { locale: fr })}
        </p>
      </div>
    </div>
  );
}