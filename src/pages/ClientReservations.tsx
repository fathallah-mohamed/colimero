import { useBookings } from "@/hooks/useBookings";
import { BookingList } from "@/components/booking/BookingList";
import { BookingListLoading } from "@/components/booking/BookingListLoading";
import { AlertCircle } from "lucide-react";

export default function ClientReservations() {
  const { data: bookings, isLoading, error } = useBookings();

  console.log("ClientReservations - Bookings:", bookings);
  console.log("ClientReservations - Loading:", isLoading);
  console.log("ClientReservations - Error:", error);

  if (isLoading) {
    return <BookingListLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erreur lors du chargement des réservations
        </h3>
        <p className="text-gray-500">
          Une erreur est survenue lors du chargement de vos réservations. Veuillez réessayer.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>
      <BookingList />
    </div>
  );
}