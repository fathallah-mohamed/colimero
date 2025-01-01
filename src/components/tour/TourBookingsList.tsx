import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TourBookingsListProps {
  tourId: number;
  tourStatus: string;
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

  const renderBookingCard = (booking: any) => {
    const specialItems = booking.special_items || [];
    
    return (
      <Card key={booking.id} className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{booking.recipient_name}</h3>
          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
            {booking.status}
          </Badge>
        </div>
        <p>Poids: {booking.weight} kg</p>
        <p>Numéro de suivi: {booking.tracking_number}</p>
        <p>Adresse de livraison: {booking.recipient_address}</p>
        <p>Téléphone: {booking.recipient_phone}</p>
        
        {specialItems && specialItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Objets spéciaux:</p>
            <div className="flex flex-wrap gap-2">
              {specialItems.map((item: string, index: number) => (
                <Badge key={`${item}-${index}`} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
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