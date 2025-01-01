import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { Edit2, CheckSquare, XSquare, RotateCcw } from "lucide-react";
import type { BookingStatus } from "@/types/booking";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: BookingStatus;
  isCollecting: boolean;
  onStatusChange: (newStatus: BookingStatus) => void;
  onUpdate: () => void;
}

export function BookingActions({
  bookingId,
  currentStatus,
  isCollecting,
  onStatusChange,
  onUpdate,
}: BookingActionsProps) {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <BookingStatusBadge status={currentStatus} />
      <div className="flex gap-2">
        {isCollecting && (
          <>
            {currentStatus === "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange("pending")}
                className="text-blue-500 hover:text-blue-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Remettre en attente
              </Button>
            )}

            {currentStatus === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange("cancelled")}
                  className="text-red-600 hover:text-red-700"
                >
                  <XSquare className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUpdate}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange("collected")}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Marquer comme collecté
                </Button>
              </>
            )}

            {currentStatus === "collected" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange("pending")}
                className="text-blue-500 hover:text-blue-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Remettre en attente
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}