import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Trash2, Eye } from "lucide-react";
import { BookingStatus } from "@/types/booking";
import { BookingActions } from "../tour/booking/BookingActions";
import { useState } from "react";

const statusMap = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmée", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
  collected: { label: "Collectée", color: "bg-blue-100 text-blue-800" },
};

interface BookingCardProps {
  booking: any;
  isCollecting?: boolean;
  onStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

export function BookingCard({ booking, isCollecting = false, onStatusChange, onUpdate }: BookingCardProps) {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const handleCancel = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
      });
    }
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (onStatusChange) {
      await onStatusChange(booking.id, newStatus);
    }
  };

  const status = statusMap[booking.status as keyof typeof statusMap];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {booking.tours?.carriers?.avatar_url ? (
            <img
              src={booking.tours.carriers.avatar_url}
              alt={booking.tours.carriers.company_name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium">
              {booking.tours?.carriers?.company_name || "Transporteur inconnu"}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(booking.tours?.departure_date), "d MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
        <Badge className={status.color}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Numéro de suivi</p>
          <p className="font-medium">{booking.tracking_number}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Poids</p>
          <p className="font-medium">{booking.weight} kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ville de collecte</p>
          <p className="font-medium">{booking.pickup_city}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ville de livraison</p>
          <p className="font-medium">{booking.delivery_city}</p>
        </div>
      </div>

      {showDetails && (
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

          {booking.special_items && booking.special_items.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Objets spéciaux</p>
              <div className="flex flex-wrap gap-2">
                {booking.special_items.map((item: any, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {item.name} (x{item.quantity})
                  </span>
                ))}
              </div>
            </div>
          )}

          {booking.content_types && booking.content_types.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Types de contenu</p>
              <div className="flex flex-wrap gap-2">
                {booking.content_types.map((type: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? "Masquer les détails" : "Voir les détails"}
          </Button>

          <div className="flex items-center gap-2">
            {isCollecting ? (
              <BookingActions
                status={booking.status}
                isCollecting={isCollecting}
                onStatusChange={handleStatusChange}
                onEdit={() => {}}
              />
            ) : booking.status === 'pending' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Êtes-vous sûr de vouloir annuler cette réservation ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-red-500 hover:bg-red-600">
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}