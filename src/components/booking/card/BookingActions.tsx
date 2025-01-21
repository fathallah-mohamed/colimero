import { BookingStatus } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Edit2, RotateCcw, CheckSquare, XCircle } from "lucide-react";
import { CancelConfirmDialog } from "../actions/CancelConfirmDialog";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  tourStatus: string;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  onEdit: () => void;
  userType: string;
}

export function BookingActions({ 
  bookingId,
  status, 
  tourStatus,
  onStatusChange, 
  onUpdate,
  onEdit,
  userType
}: BookingActionsProps) {
  const handleStatusChange = (newStatus: BookingStatus) => {
    console.log('Changing status to:', newStatus);
    onStatusChange(bookingId, newStatus);
  };

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
          {tourStatus === "Programmée" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 gap-2"
                onClick={() => handleStatusChange("cancelled")}
              >
                <XCircle className="h-4 w-4" />
                Annuler
              </Button>
              {userType === "carrier" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-500 hover:text-green-600 gap-2"
                  onClick={() => handleStatusChange("confirmed")}
                >
                  <CheckSquare className="h-4 w-4" />
                  Confirmer
                </Button>
              )}
            </>
          )}
          {tourStatus === "Ramassage en cours" && userType === "carrier" && (
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
        </>
      )}

      {status === "confirmed" && tourStatus === "Ramassage en cours" && userType === "carrier" && (
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