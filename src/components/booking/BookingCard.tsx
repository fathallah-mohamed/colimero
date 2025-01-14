import { useState } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./card/BookingCardDetails";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Calendar, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { BookingCardHeader } from "./card/BookingCardHeader";
import { BookingAddressInfo } from "./card/BookingAddressInfo";
import { BookingActions } from "./card/BookingActions";
import { useNavigation } from "@/hooks/use-navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  isEven?: boolean;
  tourStatus?: string;
}

export function BookingCard({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus = "Programmée"
}: BookingCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { userType } = useNavigation();

  const handleEditSuccess = async () => {
    await onUpdate();
    setShowEditDialog(false);
    toast({
      title: "Réservation mise à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <BookingCardHeader booking={booking} />
            <BookingAddressInfo booking={booking} />
            
            {/* Informations sur la tournée */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Informations sur la tournée</h4>
              <div className="space-y-3">
                {booking.tours?.carriers && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{booking.tours.carriers.company_name}</p>
                      {booking.tours.carriers.phone && (
                        <p className="text-sm text-gray-600">{booking.tours.carriers.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-sm text-gray-500">Date de départ</p>
                      <p className="text-sm font-medium">
                        {booking.tours?.departure_date 
                          ? format(new Date(booking.tours.departure_date), "d MMMM yyyy", { locale: fr })
                          : "Non définie"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p className="text-sm text-gray-500">Date de collecte</p>
                      <p className="text-sm font-medium">
                        {booking.tours?.collection_date 
                          ? format(new Date(booking.tours.collection_date), "d MMMM yyyy", { locale: fr })
                          : "Non définie"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Trajet</p>
                    <p className="text-sm font-medium">
                      {booking.tours?.departure_country} → {booking.tours?.destination_country}
                    </p>
                  </div>
                </div>

                <div>
                  <Badge variant="outline" className="text-sm">
                    Statut de la tournée: {booking.tours?.status || "Non défini"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Adresse de collecte */}
            <div className="mt-2 flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <div>
                <p className="text-sm text-gray-500">Adresse de collecte</p>
                <p className="text-sm font-medium">
                  {booking.pickup_city}
                </p>
              </div>
            </div>
          </div>
          
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            tourStatus={tourStatus}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onEdit={() => setShowEditDialog(true)}
            userType={userType}
          />
        </div>

        {booking.tours?.route && (
          <div className="pt-2 border-t">
            <TourRoute tour={booking.tours} />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              Masquer les détails
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Voir tous les détails
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {showDetails && <BookingCardDetails booking={booking} />}

        <EditBookingDialog
          booking={booking}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      </div>
    </Card>
  );
}