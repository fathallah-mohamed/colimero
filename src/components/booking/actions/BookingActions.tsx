import { BookingStatus } from "@/types/booking";
import { CheckSquare, XSquare, RotateCcw, Edit } from "lucide-react";
import { BookingActionButton } from "./BookingActionButton";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit 
}: BookingActionsProps) {
  if (!isCollecting) return null;

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
      <BookingActionButton
        onClick={handleEdit}
        icon={Edit}
        label="Modifier"
      />

      {status === "cancelled" && (
        <BookingActionButton
          onClick={() => handleStatusChange("pending")}
          icon={RotateCcw}
          label="Remettre en attente"
          colorClass="text-blue-500 hover:text-blue-600"
        />
      )}

      {status === "pending" && (
        <>
          <BookingActionButton
            onClick={() => handleStatusChange("cancelled")}
            icon={XSquare}
            label="Annuler"
            colorClass="text-red-500 hover:text-red-600"
          />
          <BookingActionButton
            onClick={() => handleStatusChange("collected")}
            icon={CheckSquare}
            label="Marquer comme collecté"
            colorClass="text-green-500 hover:text-green-600"
          />
        </>
      )}

      {status === "collected" && (
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