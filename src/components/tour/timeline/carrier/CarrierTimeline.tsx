import { TourStatus } from "@/types/tour";
import { TimelineBase } from "../shared/TimelineBase";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CarrierTimelineProps {
  status: TourStatus;
  tourId: number;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
}

export function CarrierTimeline({ 
  status, 
  tourId, 
  onStatusChange 
}: CarrierTimelineProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const statusOrder: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours"
  ];

  const getStatusLabel = (status: TourStatus, isCompleted: boolean): string => {
    if (!isCompleted) return status;

    switch (status) {
      case "Programmé":
        return "Préparation terminée";
      case "Ramassage en cours":
        return "Ramassage terminé";
      case "En transit":
        return "Transport terminé";
      case "Livraison en cours":
        return "Livraison terminée";
      default:
        return status;
    }
  };

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée");
    }
    setShowCancelDialog(false);
  };

  const renderCancelButton = () => {
    if (status === "Livraison terminée") return null;

    return (
      <div className="flex justify-end mt-8">
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2 hover:bg-destructive/90 transition-colors">
              <XCircle className="h-4 w-4" />
              Annuler la tournée
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler la tournée ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. La tournée sera définitivement annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirmer l'annulation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <TimelineBase
      status={status}
      statusOrder={statusOrder}
      onStatusChange={onStatusChange}
      canEdit={true}
      renderCancelButton={renderCancelButton}
      getStatusLabel={getStatusLabel}
    />
  );
}