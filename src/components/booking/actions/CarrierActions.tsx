import { Check, Edit2, X, Package, Truck, MapPin } from "lucide-react";
import { BookingStatus } from "@/types/booking";
import { ActionButton } from "./buttons/ActionButton";

interface CarrierActionsProps {
  bookingStatus: BookingStatus;
  tourStatus: string;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
  isLoading: boolean;
}

export function CarrierActions({
  bookingStatus,
  tourStatus,
  onStatusChange,
  onEdit,
  isLoading
}: CarrierActionsProps) {
  switch (bookingStatus) {
    case "pending":
      return (
        <>
          <ActionButton
            icon={Check}
            label="Confirmer"
            onClick={() => onStatusChange("confirmed")}
            isLoading={isLoading}
          />
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
    case "confirmed":
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
          <ActionButton
            icon={Package}
            label="Marquer comme Ramassée"
            onClick={() => onStatusChange("collected")}
            disabled={tourStatus !== "Ramassage en cours"}
            isLoading={isLoading}
          />
        </>
      );
    case "collected":
      return (
        <>
          <ActionButton
            icon={Edit2}
            label="Modifier"
            onClick={onEdit}
            isLoading={isLoading}
          />
          <ActionButton
            icon={Truck}
            label="Marquer comme Prête à Livrer"
            onClick={() => onStatusChange("ready_to_deliver")}
            disabled={tourStatus !== "En transit"}
            isLoading={isLoading}
          />
        </>
      );
    case "ready_to_deliver":
      return (
        <ActionButton
          icon={MapPin}
          label="Marquer comme Livrée"
          onClick={() => onStatusChange("delivered")}
          disabled={tourStatus !== "Livraison en cours"}
          isLoading={isLoading}
        />
      );
    default:
      return null;
  }
}