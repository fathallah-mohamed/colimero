import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { BookingStatusBadge } from "../BookingStatusBadge";
import { BookingActions } from "../actions/BookingActions";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Phone, User, Scale, Calendar, Clock, Truck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingCardContentProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus
}: BookingCardContentProps) {
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const updateBookingStatus = async (newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status to:", newStatus, "for booking:", booking.id);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      onStatusChange(booking.id, newStatus);
      
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleEdit = () => {
    console.log("Opening edit dialog for booking:", booking.id);
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    console.log("Edit successful, updating booking list");
    await onUpdate();
    setShowEditDialog(false);
  };

  const canModifyBooking = booking.tours?.status === "Programmée";

  return (
    <>
      <div className="flex justify-between items-start">
        <BookingHeader booking={booking} />
        <BookingStatusBadge status={currentStatus} />
      </div>
      
      {!canModifyBooking && booking.status !== "cancelled" && (
        <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cette réservation ne peut plus être modifiée ou annulée car la tournée n'est plus au statut "Programmée"
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="text-sm text-gray-500">Date de collecte</p>
              <p className="font-medium">
                {booking.tours?.collection_date 
                  ? format(new Date(booking.tours.collection_date), "d MMMM yyyy", { locale: fr })
                  : "Non définie"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <div>
              <p className="text-sm text-gray-500">Date de départ</p>
              <p className="font-medium">
                {booking.tours?.departure_date 
                  ? format(new Date(booking.tours.departure_date), "d MMMM yyyy", { locale: fr })
                  : "Non définie"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Trajet</p>
            <p className="font-medium">{booking.pickup_city} → {booking.delivery_city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Client</p>
            <p className="font-medium">{booking.sender_name}</p>
            <p className="text-sm text-gray-600">{booking.sender_phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Truck className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Destinataire</p>
            <p className="font-medium">{booking.recipient_name}</p>
            <p className="text-sm text-gray-600">{booking.recipient_phone}</p>
            <p className="text-sm text-gray-600">{booking.recipient_address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Scale className="h-4 w-4" />
          <div>
            <p className="text-sm text-gray-500">Poids et suivi</p>
            <p className="font-medium">{booking.weight} kg</p>
            <p className="text-sm text-gray-600">N° {booking.tracking_number}</p>
          </div>
        </div>

        {booking.special_items?.length > 0 && (
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4" />
            <div>
              <p className="text-sm text-gray-500">Objets spéciaux</p>
              <div className="flex flex-wrap gap-2 mt-1">
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
          <div className="mt-2 text-gray-600">
            <p className="text-sm text-gray-500">Description du colis</p>
            <p className="text-sm mt-1">{booking.package_description}</p>
          </div>
        )}
      </div>

      {canModifyBooking && (
        <div className="mt-4">
          <BookingActions
            status={currentStatus}
            isCollecting={isCollecting}
            onStatusChange={updateBookingStatus}
            onEdit={handleEdit}
            tourStatus={tourStatus}
          />
        </div>
      )}

      <EditBookingDialog
        booking={booking}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}