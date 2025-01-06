import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../tour/timeline/TimelineStatus";
import { TimelineProgress } from "../tour/timeline/TimelineProgress";
import { CancelledStatus } from "../tour/timeline/CancelledStatus";
import { Button } from "../ui/button";
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

interface TourTimelineProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
}

export function TourTimeline({ status, onStatusChange, tourId }: TourTimelineProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const statusOrder: TourStatus[] = [
    "Programmé",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours"
  ];

  const currentIndex = statusOrder.indexOf(status);

  // Calculer le pourcentage de progression
  const progress = ((currentIndex) / (statusOrder.length - 1)) * 100;

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée");
    }
    setShowCancelDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative flex justify-between items-center w-full mt-4">
        <TimelineProgress progress={progress} />
        
        {statusOrder.map((statusItem, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isNext = index === currentIndex + 1;

          let label = statusItem;
          if (isCompleted) {
            switch (statusItem) {
              case "Programmé":
                label = "Préparation terminée";
                break;
              case "Ramassage en cours":
                label = "Ramassage terminé";
                break;
              case "En transit":
                label = "Transport terminé";
                break;
              case "Livraison en cours":
                label = "Livraison terminée";
                break;
            }
          }

          return (
            <TimelineStatus
              key={statusItem}
              status={statusItem}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isNext={isNext}
              onClick={() => isNext && onStatusChange && onStatusChange(statusItem)}
              label={label}
            />
          );
        })}
      </div>

      {status !== "Livraison terminée" && onStatusChange && (
        <div className="flex justify-end mt-4">
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
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
      )}
    </div>
  );
}