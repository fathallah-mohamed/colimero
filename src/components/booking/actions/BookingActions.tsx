import { BookingStatus } from "@/types/booking";
import { CheckSquare, XSquare, RotateCcw, Edit } from "lucide-react";
import { BookingActionButton } from "./BookingActionButton";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
  tourStatus: string;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit,
  tourStatus
}: BookingActionsProps) {
  const canModifyBooking = tourStatus === 'planned';

  if (!canModifyBooking && !isCollecting) return null;

  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log("BookingActions - Changing status to:", newStatus);
    onStatusChange(newStatus);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit button clicked");
    onEdit();
  };

  return (
    <div className="flex items-center gap-2">
      {canModifyBooking && (
        <BookingActionButton
          onClick={handleEdit}
          icon={Edit}
          label="Modifier"
        />
      )}

      {status === "cancelled" && canModifyBooking && (
        <BookingActionButton
          onClick={() => handleStatusChange("pending")}
          icon={RotateCcw}
          label="Remettre en attente"
          colorClass="text-blue-500 hover:text-blue-600"
        />
      )}

      {status === "pending" && (
        <>
          {canModifyBooking && (
            <BookingActionButton
              onClick={() => handleStatusChange("cancelled")}
              icon={XSquare}
              label="Annuler"
              colorClass="text-red-500 hover:text-red-600"
            />
          )}
          {isCollecting && (
            <BookingActionButton
              onClick={() => handleStatusChange("collected")}
              icon={CheckSquare}
              label="Marquer comme collecté"
              colorClass="text-green-500 hover:text-green-600"
            />
          )}
        </>
      )}

      {status === "collected" && isCollecting && (
        <BookingActionButton
          onClick={() => handleStatusChange("pending")}
          icon={RotateCcw}
          label="Remettre en attente"
          colorClass="text-blue-500 hover:text-blue-600"
        />
      )}
    </div>
  );
}