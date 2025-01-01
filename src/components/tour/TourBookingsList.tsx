import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, XSquare, Info } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookingStatus } from "@/types/booking";

interface TourBookingsListProps {
  tourId: number;
  tourStatus: string;
}

interface SpecialItem {
  name: string;
  quantity: number;
}

export function TourBookingsList({ tourId, tourStatus }: TourBookingsListProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [tourId]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("tour_id", tourId);

    if (error) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les réservations",
      });
      return;
    }

    setBookings(data || []);
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Le statut a été mis à jour",
    });

    fetchBookings();
  };

  const renderBookingCard = (booking: any) => {
    const specialItems = booking.special_items || [];
    const isCollecting = tourStatus === "collecting";
    const isCancelled = booking.status === "cancelled";
    
    return (
      <Card key={booking.id} className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{booking.recipient_name}</h3>
          <Badge 
            variant={booking.status === "collected" ? "default" : 
                    booking.status === "cancelled" ? "destructive" : 
                    "secondary"}
          >
            {booking.status === "collected" ? "Collecté" :
             booking.status === "cancelled" ? "Annulé" :
             "En attente"}
          </Badge>
        </div>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
              <Info className="h-4 w-4" />
              Voir les détails
            </Button>
          </CollapsibleTrigger>
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
                <p className="text-sm text-gray-500">Poids</p>
                <p className="font-medium">{booking.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Numéro de suivi</p>
                <p className="font-medium">{booking.tracking_number}</p>
              </div>
            </div>

            {specialItems && specialItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Objets spéciaux:</p>
                <div className="flex flex-wrap gap-2">
                  {specialItems.map((item: SpecialItem, index: number) => (
                    <Badge key={`${item.name}-${index}`} variant="secondary">
                      {item.name} ({item.quantity})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {isCollecting && !isCancelled && (
          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => handleStatusChange(booking.id, "cancelled")}
            >
              <XSquare className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-600"
              onClick={() => handleStatusChange(booking.id, "collected")}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Marquer comme collecté
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>Aucune réservation pour cette tournée.</p>
      ) : (
        bookings.map(renderBookingCard)
      )}
    </div>
  );
}