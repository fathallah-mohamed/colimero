import { Edit2, X } from "lucide-react";
import { BookingStatus } from "@/types/booking";
import { ActionButton } from "./buttons/ActionButton";

interface ClientActionsProps {
  bookingStatus: BookingStatus;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
  isLoading: boolean;
}

export function ClientActions({
  bookingStatus,
  onStatusChange,
  onEdit,
  isLoading
}: ClientActionsProps) {
  if (bookingStatus !== "pending" && bookingStatus !== "confirmed") {
    return null;
  }

  return (
    <>
      <ActionButton
        icon={Edit2}
        label="Modifier"
        onClick={onEdit}
        isLoading={isLoading}
      />
      <ActionButton
        icon={X}
        label="Annuler"
        onClick={() => onStatusChange("cancelled")}
        isLoading={isLoading}
      />
    </>
  );
}