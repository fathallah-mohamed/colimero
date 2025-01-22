import { Button } from "@/components/ui/button";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "./CancelConfirmDialog";
import type { BookingStatus } from "@/types/booking";

interface CarrierBookingActionsProps {
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
}

export function CarrierBookingActions({
  status,
  tourStatus,
  onStatusChange,
  onEdit,
}: CarrierBookingActionsProps) {
  console.log("CarrierBookingActions - Current status:", status);
  console.log("CarrierBookingActions - Tour status:", tourStatus);

  // N'afficher les actions que si la tournée est programmée ou en cours de ramassage
  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  const handleConfirm = () => {
    console.log("Confirming booking...");
    onStatusChange("confirmed");
  };

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

      {status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={handleConfirm}
          >
            <CheckSquare className="h-4 w-4" />
            Confirmer
          </Button>
          <CancelConfirmDialog onConfirm={() => onStatusChange("cancelled")} />
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