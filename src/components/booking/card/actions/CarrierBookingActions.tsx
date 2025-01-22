import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "../../actions/CancelConfirmDialog";

interface CarrierBookingActionsProps {
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
}

export function CarrierBookingActions({
  status,
  tourStatus,
  onStatusChange,
  onEdit
}: CarrierBookingActionsProps) {
  // N'afficher les actions que si la tournée est programmée ou en cours de ramassage
  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="gap-2"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>

      {status === "pending" && tourStatus === "Programmée" && (
        <>
          <CancelConfirmDialog onConfirm={() => onStatusChange("cancelled")} />
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => onStatusChange("confirmed")}
          >
            <CheckSquare className="h-4 w-4" />
            Confirmer
          </Button>
        </>
      )}

      {status === "confirmed" && tourStatus === "Ramassage en cours" && (
        <>
          <CancelConfirmDialog onConfirm={() => onStatusChange("cancelled")} />
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => onStatusChange("collected")}
          >
            <CheckSquare className="h-4 w-4" />
            Marquer comme collectée
          </Button>
        </>
      )}

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600 gap-2"
          onClick={() => onStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4" />
          Remettre en attente
        </Button>
      )}
    </div>
  );
}