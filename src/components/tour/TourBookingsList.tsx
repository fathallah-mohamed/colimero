import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const statusMap = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export function TourBookingsList({ bookings }: { bookings: any[] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-sm text-gray-500 mt-4">
        Aucune réservation pour cette tournée
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-sm font-medium text-gray-700">Réservations</h3>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Package className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{booking.recipient_name}</p>
                  <p className="text-sm text-gray-500">{booking.recipient_phone}</p>
                </div>
              </div>
              <Badge className={statusMap[booking.status as keyof typeof statusMap].color}>
                {statusMap[booking.status as keyof typeof statusMap].label}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Ville de collecte</p>
                <p className="font-medium">{booking.pickup_city}</p>
              </div>
              <div>
                <p className="text-gray-500">Ville de livraison</p>
                <p className="font-medium">{booking.delivery_city}</p>
              </div>
              <div>
                <p className="text-gray-500">Poids</p>
                <p className="font-medium">{booking.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-500">Numéro de suivi</p>
                <p className="font-medium">{booking.tracking_number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}