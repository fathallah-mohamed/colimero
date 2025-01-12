import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tour, TourStatus } from "@/types/tour";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Eye, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TourStatusTimeline } from "./TourStatusTimeline";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingListItem } from "./booking/BookingListItem";
import { supabase } from "@/integrations/supabase/client";

interface TourCardProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (tourId: number) => void;
  onStatusChange: (tourId: number, newStatus: TourStatus) => void;
  selectedPickupCity?: string;
  onPickupCitySelect?: (city: string) => void;
  isBookingEnabled?: boolean;
  isPickupSelectionEnabled?: boolean;
  bookingButtonText?: string;
  onBookingClick?: () => void;
}

export function TourCard({
  tour,
  onEdit,
  onDelete,
  onStatusChange,
  selectedPickupCity,
  onPickupCitySelect,
  isBookingEnabled,
  isPickupSelectionEnabled,
  bookingButtonText,
  onBookingClick
}: TourCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCarrier, setIsCarrier] = useState(false);

  const checkCarrierStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsCarrier(session.user.id === tour.carrier_id);
    }
  };

  React.useEffect(() => {
    checkCarrierStatus();
  }, [tour.carrier_id]);

  const getNextStatus = (currentStatus: TourStatus): TourStatus | null => {
    const statusOrder: TourStatus[] = [
      "Programmée",
      "Ramassage en cours",
      "En transit",
      "Livraison en cours",
      "Terminée"
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  };

  const handleStatusChange = async (newStatus: TourStatus) => {
    try {
      onStatusChange(tour.id, newStatus);
      toast({
        title: "Statut mis à jour",
        description: `La tournée est maintenant ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  // Afficher les boutons d'action si l'utilisateur est le transporteur et que la tournée n'est pas terminée ou annulée
  const showStatusButtons = isCarrier && tour.status !== "Terminée" && tour.status !== "Annulée";
  const nextStatus = getNextStatus(tour.status);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              {tour.departure_country} → {tour.destination_country}
            </h3>
            <Badge className={tour.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
              {tour.type === 'public' ? 'Public' : 'Privé'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Départ : {format(parseISO(tour.departure_date), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isCarrier && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(tour)}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showStatusButtons && (
        <div className="flex gap-2 mt-4">
          {nextStatus && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleStatusChange(nextStatus)}
            >
              Passer à {nextStatus}
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => handleStatusChange("Annulée")}
          >
            Annuler la tournée
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Eye className="h-4 w-4" />
        {isExpanded ? "Masquer les détails" : "Voir les détails"}
      </Button>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-4 mt-4">
          <TourStatusTimeline
            tourId={tour.id}
            status={tour.status}
            onStatusChange={handleStatusChange}
          />

          {tour.bookings && tour.bookings.length > 0 ? (
            <div className="space-y-3">
              {tour.bookings.map((booking) => (
                <BookingListItem key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Aucune réservation pour cette tournée.
              </AlertDescription>
            </Alert>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}