import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "../BookingStatusBadge";
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
        {isCollecting && currentStatus === "pending" && (
          <>
            <Button
              variant="outline"
              onClick={() => onStatusChange("rejected")}
              className="text-red-600 hover:text-red-700"
            >
              Refuser
            </Button>
            <Button
              onClick={() => onStatusChange("accepted")}
              className="bg-green-600 hover:bg-green-700"
            >
              Accepter
            </Button>
          </>
        )}
        {currentStatus === "accepted" && (
          <Button
            onClick={() => onStatusChange("collected")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Marquer comme collecté
          </Button>
        )}
        {currentStatus === "collected" && (
          <Button
            onClick={() => onStatusChange("in_transit")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            En transit
          </Button>
        )}
        {currentStatus === "in_transit" && (
          <Button
            onClick={() => onStatusChange("delivered")}
            className="bg-green-600 hover:bg-green-700"
          >
            Marquer comme livré
          </Button>
        )}
      </div>
    </div>
  );
}