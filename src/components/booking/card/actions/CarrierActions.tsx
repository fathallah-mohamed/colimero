import { BookingStatus } from "@/types/booking";
import { ThumbsUp, AlertTriangle } from "lucide-react";
import { ActionButton } from "@/components/shared/ActionButton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Edit2, RotateCcw } from "lucide-react";

interface CarrierActionsProps {
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
}

export function CarrierActions({
  status,
  tourStatus,
  onStatusChange,
  onEdit
}: CarrierActionsProps) {
  const canModifyInTransit = tourStatus === "En transit" && status !== "cancelled";
  const canModifyInPlanned = (status === "pending" || status === "confirmed") && tourStatus === "Programmée";

  // Si la tournée passe en transit, mettre à jour le statut des réservations
  if (tourStatus === "En transit" && status === "confirmed") {
    console.log("Updating booking status to in_transit");
    onStatusChange("in_transit");
  }

  if (!canModifyInTransit && !canModifyInPlanned) {
    return null;
  }

  const handleConfirm = () => {
    console.log("Confirming booking...");
    onStatusChange("confirmed");
  };

  const handleReport = () => {
    console.log("Reporting booking...");
    onStatusChange("reported");
  };

  const handleCancel = () => {
    console.log("Cancelling booking...");
    onStatusChange("cancelled" as BookingStatus);
  };

  return (
    <>
      {canModifyInPlanned && status === "pending" && (
        <ActionButton
          icon={ThumbsUp}
          label="Confirmer"
          onClick={handleConfirm}
          colorClass="bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
        />
      )}
      
      {status !== "cancelled" && (
        <ActionButton
          icon={Edit2}
          label="Modifier"
          onClick={onEdit}
          colorClass="bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
        />
      )}
      
      {canModifyInTransit && (
        <ActionButton
          icon={AlertTriangle}
          label="Signaler"
          onClick={handleReport}
          colorClass="bg-white hover:bg-gray-50 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
        />
      )}
      
      {status !== "cancelled" && (
        <ConfirmDialog
          title="Confirmer l'annulation"
          description="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée."
          icon={RotateCcw}
          buttonLabel="Annuler"
          buttonColorClass="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          onConfirm={handleCancel}
        />
      )}
    </>
  );
}