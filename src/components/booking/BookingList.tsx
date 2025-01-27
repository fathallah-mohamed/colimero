import { AlertCircle } from "lucide-react";
import { BookingCard } from "./BookingCard";
import { BookingListLoading } from "./BookingListLoading";
import { EmptyBookingList } from "./EmptyBookingList";
import { useBookings } from "@/hooks/useBookings";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BookingStatus } from "@/types/booking";
import { useProfile } from "@/hooks/use-profile";

export function BookingList() {
  const { data: bookings = [], isLoading, error, refetch } = useBookings();
  const { toast } = useToast();
  const { userType } = useProfile();

  if (isLoading) {
    return <BookingListLoading />;
  }

  if (error) {
    console.error("Error loading bookings:", error);
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erreur lors du chargement des réservations
        </h3>
        <p className="text-gray-500">
          Une erreur est survenue lors du chargement de vos réservations. Veuillez réessayer.
        </p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return <EmptyBookingList />;
  }

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      console.log("BookingList - Updating booking status:", { bookingId, newStatus });
      
      // Check if there's already a pending booking for this tour
      if (newStatus === 'pending') {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const { data: existingBooking, error: checkError } = await supabase
          .from('bookings')
          .select('id')
          .eq('tour_id', booking.tour_id)
          .eq('user_id', booking.user_id)
          .eq('status', 'pending')
          .maybeSingle();

        if (existingBooking) {
          toast({
            variant: "destructive",
            title: "Action impossible",
            description: "Vous avez déjà une réservation en attente pour cette tournée.",
          });
          return;
        }
      }

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error("Error updating booking status:", updateError);
        
        if (updateError.code === '23505') {
          toast({
            variant: "destructive",
            title: "Action impossible",
            description: "Vous avez déjà une réservation en attente pour cette tournée.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour du statut.",
          });
        }
        return;
      }

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

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isCollecting={booking.tours?.status === "Ramassage en cours"}
          onStatusChange={handleStatusChange}
          onUpdate={async () => { await refetch(); }}
          tourStatus={booking.tours?.status}
          userType={userType}
        />
      ))}
    </div>
  );
}