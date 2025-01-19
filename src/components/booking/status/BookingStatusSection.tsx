import { BookingStatusBadge } from "../BookingStatusBadge";
import { useBookingStatus } from "@/hooks/useBookingStatus";
import type { Booking } from "@/types/booking";

interface BookingStatusSectionProps {
  booking: Booking;
}

export function BookingStatusSection({ booking }: BookingStatusSectionProps) {
  const currentStatus = useBookingStatus(booking.id, booking.status);
  return <BookingStatusBadge status={currentStatus} />;
}