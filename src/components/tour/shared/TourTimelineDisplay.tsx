import { TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Edit, Truck, Plane, Package, CheckCircle, XCircle } from "lucide-react";
import { CancelTourDialog } from "../timeline/dialogs/CancelTourDialog";
import { PendingBookingsDialog } from "../timeline/dialogs/PendingBookingsDialog";
import { UncollectedBookingsDialog } from "../timeline/dialogs/UncollectedBookingsDialog";
import { useTourStatusManagement } from "../timeline/hooks/useTourStatusManagement";
import type { BookingStatus } from "@/types/booking";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  onBookingStatusChange?: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  tourId: number;
  userType?: string;
  canEdit?: boolean;
  variant?: 'client' | 'carrier';
  onEdit?: () => void;
}

export function TourTimelineDisplay({ 
  status, 
  onStatusChange, 
  onBookingStatusChange,
  tourId,
  userType,
  canEdit = false,
  variant = 'carrier',
  onEdit
}: TourTimelineDisplayProps) {
  const {
    showCancelDialog,
    setShowCancelDialog,
    showPendingBookingsDialog,
    setShowPendingBookingsDialog,
    showUncollectedBookingsDialog,
    setShowUncollectedBookingsDialog,
    handleCancel,
    handleStartCollection,
    handleStartTransit,
    handleStartDelivery,
    handleComplete
  } = useTourStatusManagement({ 
    tourId, 
    onStatusChange: (newStatus) => onStatusChange?.(tourId, newStatus),
    onBookingStatusChange
  });

  console.log("TourTimelineDisplay - Current status:", status, "Tour ID:", tourId);

  // If the tour is cancelled, show cancelled message
  if (status === "Annulée") {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700 font-medium">Cette tournée a été annulée</span>
      </div>
    );
  }

  const isActive = !["Terminée", "Annulée"].includes(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        {status === "Programmée" && canEdit && (
          <Button 
            onClick={handleStartCollection}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Truck className="h-4 w-4 mr-2" />
            Démarrer le ramassage
          </Button>
        )}

        {status === "Ramassage en cours" && canEdit && (
          <Button 
            onClick={handleStartTransit}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plane className="h-4 w-4 mr-2" />
            Démarrer le transit
          </Button>
        )}

        {status === "En transit" && canEdit && (
          <Button 
            onClick={handleStartDelivery}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Package className="h-4 w-4 mr-2" />
            Démarrer la livraison
          </Button>
        )}

        {status === "Livraison en cours" && canEdit && (
          <Button 
            onClick={handleComplete}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminer la tournée
          </Button>
        )}

        {isActive && canEdit && (
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier la tournée
            </Button>

            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Annuler la tournée
            </Button>
          </div>
        )}
      </div>

      <CancelTourDialog 
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onCancel={handleCancel}
      />

      <PendingBookingsDialog 
        open={showPendingBookingsDialog}
        onOpenChange={setShowPendingBookingsDialog}
      />

      <UncollectedBookingsDialog 
        open={showUncollectedBookingsDialog}
        onOpenChange={setShowUncollectedBookingsDialog}
      />
    </div>
  );
}