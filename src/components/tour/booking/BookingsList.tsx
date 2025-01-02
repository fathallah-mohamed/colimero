import { BookingCard } from "@/components/booking/BookingCard";
import type { BookingStatus } from "@/types/booking";

interface BookingsListProps {
  bookings: any[];
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
}

export function BookingsList({
  bookings,
  isCollecting,
  onStatusChange,
  onUpdate,
  tourStatus
}: BookingsListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          isCollecting={isCollecting}
          onStatusChange={onStatusChange}
          onUpdate={onUpdate}
          isEven={index % 2 === 0}
          tourStatus={tourStatus}
        />
      ))}
    </div>
  );
}