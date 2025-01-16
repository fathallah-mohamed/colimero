import { BookingStatus } from "@/types/booking";
import { ThumbsUp } from "lucide-react";
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
  const canModifyInCollection = status === "pending" && tourStatus === "Ramassage en cours";
  const canModifyInPlanned = (status === "pending" || status === "confirmed") && tourStatus === "Programmée";

  if (!canModifyInCollection && !canModifyInPlanned) {
    return null;
  }

  return (
    <>
      {canModifyInPlanned && status === "pending" && (
        <ActionButton
          icon={ThumbsUp}
          label="Confirmer"
          onClick={() => onStatusChange("confirmed")}
          colorClass="bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
        />
      )}
      
      <ActionButton
        icon={Edit2}
        label="Modifier"
        onClick={onEdit}
        colorClass="bg-white hover:bg-gray-50 text-[#8B5CF6] hover:text-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]"
      />
      
      <ConfirmDialog
        title="Confirmer l'annulation"
        description="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée."
        icon={RotateCcw}
        buttonLabel="Annuler"
        buttonColorClass="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
        onConfirm={() => onStatusChange("cancelled")}
      />
    </>
  );
}