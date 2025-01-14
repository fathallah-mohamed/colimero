import { TourStatus } from "@/types/tour";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, XCircle, Truck } from "lucide-react";
import { useState } from "react";
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

  const handleCancel = async () => {
    if (onStatusChange) {
      await onStatusChange("Annulée" as TourStatus);
    }
    setShowCancelDialog(false);
  };

  const handleEdit = () => {
    navigate(`/planifier-une-tournee?tourId=${tourId}`);
  };

  const handleStartCollection = async () => {
    if (onStatusChange) {
      await onStatusChange("Ramassage en cours" as TourStatus);
    }
  };

  if (status === "Annulée") {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700 font-medium">Cette tournée a été annulée</span>
      </div>
    );
  }

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
    </div>
  );
}