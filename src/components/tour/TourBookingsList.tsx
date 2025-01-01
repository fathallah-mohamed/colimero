import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BookingStatus } from "@/types/booking";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function TourBookingsList({ tourId }: { tourId: number }) {
  const { data: bookings, refetch } = useQuery({
    queryKey: ["tour-bookings", tourId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("tour_id", tourId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });
      refetch();
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
      });
    }
  };

  if (!bookings?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune réservation pour cette tournée
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white p-4 rounded-lg shadow-sm space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                {booking.sender_name || "Expéditeur inconnu"}
              </h4>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.created_at), "d MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {booking.status === "pending" && (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      updateBookingStatus(booking.id, "cancelled")
                    }
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      updateBookingStatus(booking.id, "collected")
                    }
                  >
                    Marquer comme collecté
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Expéditeur</p>
              <p>{booking.sender_name}</p>
              <p>{booking.sender_phone}</p>
              <p>{booking.pickup_city}</p>
            </div>
            <div>
              <p className="text-gray-600">Destinataire</p>
              <p>{booking.recipient_name}</p>
              <p>{booking.recipient_phone}</p>
              <p>{booking.delivery_city}</p>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-gray-600">Détails du colis</p>
            <p>Poids: {booking.weight} kg</p>
            <p>Type: {booking.item_type}</p>
            {booking.special_items && booking.special_items.length > 0 && (
              <p>
                Objets spéciaux:{" "}
                {(booking.special_items as string[]).join(", ")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}