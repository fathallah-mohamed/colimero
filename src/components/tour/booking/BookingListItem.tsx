import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Package, Phone, User, Scale, Info, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Booking } from "@/types/booking";

interface BookingListItemProps {
  booking: Booking;
}

export function BookingListItem({ booking }: BookingListItemProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <Card key={booking.id} className="p-3">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="secondary">
              {booking.status}
            </Badge>
            <p className="font-medium mt-2">{booking.tracking_number}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Expéditeur</p>
                  <p className="font-medium">{booking.sender_name || 'Non spécifié'}</p>
                  <p className="text-sm text-gray-600">{booking.sender_phone || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-1 text-gray-500" />
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
            </div>

            <div className="flex items-start gap-2">
              <Scale className="h-4 w-4 mt-1 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Poids</p>
                <p className="font-medium">{booking.weight} kg</p>
              </div>
            </div>

            {booking.content_types && booking.content_types.length > 0 && (
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Types de contenu</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {booking.content_types.map((type: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {booking.special_items && booking.special_items.length > 0 && (
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 mt-1 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Objets spéciaux</p>
                  <div className="flex flex-wrap gap-2 mt-2">
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
                    {formatDate(booking.created_at)}
                  </p>
                  {booking.updated_at && (
                    <p className="text-sm">
                      <span className="font-medium">Dernière mise à jour:</span>{" "}
                      {formatDate(booking.updated_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}