import { BookingStatus } from "@/types/booking";
import { BookingActionButtons } from "./BookingActionButtons";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
  tourStatus?: string;
  isUpdating: boolean;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit,
  tourStatus,
  isUpdating
}: BookingActionsProps) {
  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log("BookingActions - Changing status to:", newStatus);
    onStatusChange(newStatus);
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
    onEdit();
  };

  // Afficher les boutons pour le statut "collecting"
  if (isCollecting) {
    return (
      <div className="flex items-center gap-2">
        <BookingActionButtons
          status={status}
          isUpdating={isUpdating}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      </div>
    );
  }

  // Afficher les boutons pour le statut "planned"
  if (tourStatus === 'planned') {
    return (
      <div className="flex items-center gap-2">
        <BookingActionButtons
          status={status}
          isUpdating={isUpdating}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      </div>
    );
  }

  return null;
}