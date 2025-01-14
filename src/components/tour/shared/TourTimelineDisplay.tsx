import { TourStatus } from "@/types/tour";
import { TimelineStatus } from "../timeline/TimelineStatus";
import { TimelineProgress } from "../timeline/TimelineProgress";
import { CancelledStatus } from "../timeline/CancelledStatus";
import { Button } from "@/components/ui/button";
import { XCircle, Edit } from "lucide-react";
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
import { motion } from "framer-motion";
import { TimelineMobileView } from "../timeline/TimelineMobileView";
import { useNavigate } from "react-router-dom";

interface TourTimelineDisplayProps {
  status: TourStatus;
  onStatusChange?: (newStatus: TourStatus) => Promise<void>;
  tourId: number;
  userType?: string;
  canEdit?: boolean;
  variant?: 'client' | 'carrier';
}

export function TourTimelineDisplay({ 
  status, 
  onStatusChange, 
  tourId,
  userType,
  canEdit = false,
  variant = 'carrier'
}: TourTimelineDisplayProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const navigate = useNavigate();

  if (status === "Annulée") {
    return <CancelledStatus />;
  }

  const statusOrder: TourStatus[] = [
    "Programmée",
    "Ramassage en cours",
    "En transit",
    "Livraison en cours",
    "Terminée"
  ];

  const currentIndex = statusOrder.indexOf(status);
  const progress = ((currentIndex) / (statusOrder.length - 1)) * 100;

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée" as TourStatus);
    }
    setShowCancelDialog(false);
  };

  const handleEdit = () => {
    navigate(`/planifier-une-tournee?tourId=${tourId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Vue mobile */}
      <TimelineMobileView status={status} variant={variant} />

      {/* Vue desktop */}
      <div className="relative hidden lg:flex justify-between items-center w-full mt-8 px-4">
        <TimelineProgress progress={progress} variant={variant} />
        
        {statusOrder.map((statusItem, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isNext = index === currentIndex + 1;

          // Combiner les étapes "Livraison en cours" et "Terminée"
          if (statusItem === "Terminée") {
            return null;
          }

          const label = statusItem === "Livraison en cours" ? "Livraison" : statusItem;

          return (
            <TimelineStatus
              key={statusItem}
              status={statusItem}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isNext={isNext && canEdit}
              onClick={() => isNext && canEdit && onStatusChange && onStatusChange(statusItem)}
              label={label}
              variant={variant}
            />
          );
        })}
      </div>

      {status !== "Terminée" && canEdit && (
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier la tournée
          </Button>

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
      )}
    </motion.div>
  );
}