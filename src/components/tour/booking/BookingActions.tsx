import { Button } from "@/components/ui/button";
import { BookingStatus } from "@/types/booking";
import { CheckSquare, XSquare, RotateCcw, Edit } from "lucide-react";

interface BookingActionsProps {
  status: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (status: BookingStatus) => void;
  onEdit: () => void;
}

export function BookingActions({ status, isCollecting, onStatusChange, onEdit }: BookingActionsProps) {
  if (!isCollecting) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4 mr-2" />
        Modifier
      </Button>

      {status === "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600"
          onClick={() => onStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Remettre en attente
        </Button>
      )}

      {status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onStatusChange("cancelled")}
          >
            <XSquare className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-green-500 hover:text-green-600"
            onClick={() => onStatusChange("collected")}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Marquer comme collecté
          </Button>
        </>
      )}

      {status === "collected" && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500 hover:text-blue-600"
          onClick={() => onStatusChange("pending")}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Remettre en attente
        </Button>
      )}
    </div>
  );
}