import { Info, Package, MapPin, Phone, User, Scale, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingCardDetailsProps {
  booking: any;
}

export function BookingCardDetails({ booking }: BookingCardDetailsProps) {
  return (
    <div className="mt-4 space-y-6 border-t pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Expéditeur</p>
            <p className="font-medium">{booking.sender_name}</p>
            <p className="text-sm text-gray-600">{booking.sender_phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Destinataire</p>
            <p className="font-medium">{booking.recipient_name}</p>
            <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
            <p className="text-sm text-gray-600">{booking.recipient_address}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Ville de collecte</p>
            <p className="font-medium">{booking.pickup_city}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Ville de livraison</p>
            <p className="font-medium">{booking.delivery_city}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Scale className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Poids</p>
            <p className="font-medium">{booking.weight} kg</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Package className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Numéro de suivi</p>
            <p className="font-medium">{booking.tracking_number}</p>
          </div>
        </div>
      </div>

      {booking.content_types?.length > 0 && (
        <div className="flex items-start gap-2">
          <Package className="h-4 w-4 mt-1 text-gray-500" />
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
        </div>
      )}

      {booking.special_items?.length > 0 && (
        <div className="flex items-start gap-2">
          <Package className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
            <div className="flex flex-wrap gap-2">
              {booking.special_items.map((item: any, index: number) => (
                <Badge key={index} variant="secondary">
                  {item.name} {item.quantity && `(${item.quantity})`}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {booking.package_description && (
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Description du colis</p>
            <p className="text-sm">{booking.package_description}</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        <Calendar className="h-4 w-4 mt-1 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Dates</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Créée le:</span>{" "}
              {format(new Date(booking.created_at), "d MMMM yyyy", { locale: fr })}
            </p>
            {booking.updated_at && (
              <p className="text-sm">
                <span className="font-medium">Dernière mise à jour:</span>{" "}
                {format(new Date(booking.updated_at), "d MMMM yyyy", { locale: fr })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}