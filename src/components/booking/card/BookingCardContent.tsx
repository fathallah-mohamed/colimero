import { useState } from "react";
import { EditBookingDialog } from "../EditBookingDialog";
import type { BookingStatus } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { BookingCardDetails } from "./BookingCardDetails";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourRoute } from "@/components/send-package/tour/components/TourRoute";
import { BookingHeader } from "./BookingHeader";
import { BookingActions } from "./BookingActions";

interface BookingCardContentProps {
  booking: any;
  isCollecting: boolean;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
  onUpdate: () => Promise<void>;
  tourStatus?: string;
  isCarrier?: boolean;
}

export function BookingCardContent({ 
  booking, 
  isCollecting, 
  onStatusChange,
  onUpdate,
  tourStatus = "Programmée",
  isCarrier = false
}: BookingCardContentProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState("");
  const { toast } = useToast();

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditSuccess = async () => {
    await onUpdate();
    setShowEditDialog(false);
    toast({
      title: "Réservation mise à jour",
      description: "Les modifications ont été enregistrées avec succès.",
    });
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    await onStatusChange(booking.id, newStatus);
    await onUpdate();
  };

  const handlePointSelect = (point: string) => {
    setSelectedPoint(point);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BookingHeader booking={booking} />
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            tourStatus={tourStatus}
            onStatusChange={handleStatusChange}
            onUpdate={onUpdate}
            onEdit={handleEdit}
          />
        </div>

        {booking.tours?.route && (
          <div className="mt-4 border-t pt-4">
            <TourRoute 
              stops={booking.tours.route} 
              selectedPoint={selectedPoint}
              onPointSelect={handlePointSelect}
            />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              Masquer les détails
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Voir tous les détails de la réservation
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>

        {showDetails && <BookingCardDetails booking={booking} />}

        <EditBookingDialog
          booking={booking}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      </div>
    </Card>
  );
}