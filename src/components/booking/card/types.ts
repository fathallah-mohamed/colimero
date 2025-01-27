import { BookingStatus } from "@/types/booking";

export interface BookingActionProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus?: string;
  onStatusChange: (newStatus: BookingStatus) => Promise<void>;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType?: string;
  tourId: number;
  userId: string;
}