import { BookingActionButton } from "./BookingActionButton";
import { CheckSquare, XSquare, RotateCcw, Edit } from "lucide-react";
import type { BookingStatus } from "@/types/booking";

interface BookingActionButtonsProps {
  status: BookingStatus;
  isUpdating: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
}

export function BookingActionButtons({
  status,
  isUpdating,
  onStatusChange,
  onEdit
}: BookingActionButtonsProps) {
  return (
    <>
      <BookingActionButton
        onClick={() => onEdit()}
        icon={Edit}
        label="Modifier"
        disabled={isUpdating}
      />

      {status === "cancelled" && (
        <BookingActionButton
          onClick={() => onStatusChange("pending")}
          icon={RotateCcw}
          label="Remettre en attente"
          colorClass="text-blue-500 hover:text-blue-600"
          disabled={isUpdating}
        />
      )}

      {status === "pending" && (
        <>
          <BookingActionButton
            onClick={() => onStatusChange("cancelled")}
            icon={XSquare}
            label="Annuler"
            colorClass="text-red-500 hover:text-red-600"
            disabled={isUpdating}
          />
          <BookingActionButton
            onClick={() => onStatusChange("collected")}
            icon={CheckSquare}
            label="Marquer comme collecté"
            colorClass="text-green-500 hover:text-green-600"
            disabled={isUpdating}
          />
        </>
      )}

      {status === "collected" && (
        <BookingActionButton
          onClick={() => onStatusChange("pending")}
          icon={RotateCcw}
          label="Remettre en attente"
          colorClass="text-blue-500 hover:text-blue-600"
          disabled={isUpdating}
        />
      )}
    </>
  );
}