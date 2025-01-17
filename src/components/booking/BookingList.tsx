import { AlertCircle } from "lucide-react";
import { BookingCard } from "./BookingCard";
import { BookingListLoading } from "./BookingListLoading";
import { EmptyBookingList } from "./EmptyBookingList";
import { useBookings } from "@/hooks/useBookings";
import type { BookingStatus } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function BookingList() {
  const { data: bookings, isLoading, error, refetch } = useBookings();
  const { toast } = useToast();
  const user = useUser();

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      console.log("Updating booking status:", { bookingId, newStatus });
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          delivery_status: newStatus 
        })
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) {
        console.error("Error updating booking status:", error);
        throw error;
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
          onUpdate={refetch}
          isEven={false}
        />
      ))}
    </div>
  );
}