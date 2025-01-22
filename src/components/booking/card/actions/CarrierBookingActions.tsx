import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { Edit2, RotateCcw, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "./CancelConfirmDialog";

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
  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log('CarrierBookingActions - Changing status to:', newStatus);
    onStatusChange(newStatus);
  };

  // Ne montrer les actions que pour les tournées programmées ou en cours de ramassage
  if (!['Programmée', 'Ramassage en cours'].includes(tourStatus)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
      >
        <Edit2 className="h-4 w-4" />
        Modifier
      </Button>

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600 gap-2"
          onClick={() => handleStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4" />
          Remettre en attente
        </Button>
      )}

      {status === "pending" && tourStatus === "Programmée" && (
        <>
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => handleStatusChange("confirmed")}
          >
            <CheckSquare className="h-4 w-4" />
            Confirmer
          </Button>
        </>
      )}

      {status === "confirmed" && tourStatus === "Ramassage en cours" && (
        <>
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600 gap-2"
            onClick={() => handleStatusChange("collected")}
          >
            <CheckSquare className="h-4 w-4" />
            Marquer comme collectée
          </Button>
        </>
      )}
    </div>
  );
}