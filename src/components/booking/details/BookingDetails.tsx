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
          <p className="text-sm text-gray-500">Destinataire</p>
          <p className="font-medium">{booking.recipient_name}</p>
          <p className="text-sm text-gray-500">{booking.recipient_phone}</p>
          <p className="text-sm text-gray-500">{booking.recipient_address}</p>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Date de collecte</p>
          <p className="font-medium">
            {format(new Date(booking.tours?.collection_date), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date de départ</p>
          <p className="font-medium">
            {format(new Date(booking.tours?.departure_date), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Transporteur</p>
        <div className="flex items-center gap-2">
          {booking.tours?.carriers?.avatar_url && (
            <img 
              src={booking.tours.carriers.avatar_url} 
              alt="Avatar du transporteur"
              className="w-8 h-8 rounded-full"
            />
          )}
          <p className="font-medium">{booking.tours?.carriers?.company_name}</p>
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

      {booking.package_description && (
        <div>
          <p className="text-sm text-gray-500">Description du colis</p>
          <p className="text-sm">{booking.package_description}</p>
        </div>
      )}
    </div>
  );
}