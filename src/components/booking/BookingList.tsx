import { BookingCard } from "./BookingCard";
import { BookingListLoading } from "./BookingListLoading";
import { EmptyBookingList } from "./EmptyBookingList";
import { BookingError } from "./BookingError";
import { useBookings } from "@/hooks/useBookings";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import type { BookingStatus } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function BookingList() {
  const { data: bookings, isLoading, error, refetch } = useBookings();
  const { toast } = useToast();
  const user = useUser();

  // Use the new session check hook
  useSessionCheck();

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status:", { bookingId, newStatus });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', bookingId);

      if (error) throw error;

      await refetch();

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la réservation a été mis à jour avec succès.",
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
      });
    }
  };

  if (!user) {
    return (
      <BookingError
        title="Authentification requise"
        description="Veuillez vous connecter pour voir vos réservations."
      />
    );
  }

  if (isLoading) {
    return <BookingListLoading />;
  }

  if (error) {
    console.error("Error loading bookings:", error);
    return (
      <BookingError
        title="Erreur lors du chargement des réservations"
        description="Une erreur est survenue lors du chargement de vos réservations. Veuillez réessayer."
      />
    );
  }

  if (!bookings?.length) {
    return <EmptyBookingList />;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isCollecting={true}
          onStatusChange={handleStatusChange}
          onUpdate={async () => { await refetch(); }}
          isEven={false}
        />
      ))}
    </div>
  );
}