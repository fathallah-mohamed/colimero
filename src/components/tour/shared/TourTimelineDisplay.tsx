import { TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { Edit, Truck, Plane, Package, CheckCircle, XCircle } from "lucide-react";
import { CancelTourDialog } from "../timeline/dialogs/CancelTourDialog";
import { PendingBookingsDialog } from "../timeline/dialogs/PendingBookingsDialog";
import { useTourStatusManagement } from "../timeline/hooks/useTourStatusManagement";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (tourId: number, newStatus: TourStatus) => Promise<void>;
  tourId: number;
  userType?: string;
  canEdit?: boolean;
  variant?: 'client' | 'carrier';
  onEdit?: () => void;
}

export function TourTimelineDisplay({ 
  status, 
  onStatusChange, 
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
    handleCancel,
    handleStartCollection,
    handleStartTransit,
    handleStartDelivery,
    handleComplete
  } = useTourStatusManagement({ 
    tourId, 
    onStatusChange: (newStatus) => onStatusChange?.(tourId, newStatus)
  });

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
      </div>

      {isActive && canEdit && (
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier la tournée
          </Button>

          <CancelTourDialog 
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            onCancel={handleCancel}
          />
        </div>
      )}

      <PendingBookingsDialog 
        open={showPendingBookingsDialog}
        onOpenChange={setShowPendingBookingsDialog}
      />
    </div>
  );
}