import { BookingStatus } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Edit2, RotateCcw, XCircle, CheckSquare } from "lucide-react";
import { CancelConfirmDialog } from "./CancelConfirmDialog";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (newStatus: BookingStatus) => void;
  onEdit: () => void;
  tourStatus?: string;
  userType?: string;
}

export function BookingActions({ 
  status, 
  isCollecting, 
  onStatusChange, 
  onEdit,
  tourStatus,
  userType
}: BookingActionsProps) {
  // On autorise les actions si on est en collecte OU si la tournée est programmée
  if (!isCollecting && tourStatus !== "Programmée") return null;

  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log('Changing status to:', newStatus);
    onStatusChange(newStatus);
  };

  // Actions pour les clients
  if (userType === 'client') {
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
          <CancelConfirmDialog onConfirm={() => handleStatusChange("cancelled")} />
        )}
      </div>
    );
  }

  // Actions pour les transporteurs
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

      {status === "pending" && (
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
    </div>
  );
}