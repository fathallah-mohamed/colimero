import { BookingStatus } from "@/types/booking";
import { ReactNode } from "react";

export interface BookingActionProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus?: string;
  onStatusChange: (newStatus: BookingStatus) => Promise<void>;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType?: string;
}

export interface StatusChangeButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}