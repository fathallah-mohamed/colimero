import { useTourBookings } from "@/hooks/use-tour-bookings";
import { BookingFilters } from "./booking/BookingFilters";
import { BookingsList } from "./booking/BookingsList";
import { EmptyBookingsList } from "./booking/EmptyBookingsList";

interface TourBookingsListProps {
  tourId: number;
  tourStatus: string;
}

export function TourBookingsList({ tourId, tourStatus }: TourBookingsListProps) {
  const {
    bookings,
    cities,
    selectedCity,
    selectedStatus,
    selectedSort,
    setSelectedCity,
    setSelectedStatus,
    setSelectedSort,
    handleStatusChange,
    fetchBookings
  } = useTourBookings(tourId);

  return (
    <div className="space-y-4">
      {bookings.length > 0 && (
        <BookingFilters
          cities={cities}
          onCityChange={setSelectedCity}
          onStatusChange={setSelectedStatus}
          onSortChange={setSelectedSort}
          selectedCity={selectedCity}
          selectedStatus={selectedStatus}
          selectedSort={selectedSort}
        />
      )}

      {bookings.length === 0 ? (
        <EmptyBookingsList />
      ) : (
        <BookingsList
          bookings={bookings}
          isCollecting={tourStatus === "collecting"}
          onStatusChange={handleStatusChange}
          onUpdate={fetchBookings}
          tourStatus={tourStatus}
        />
      )}
    </div>
  );
}