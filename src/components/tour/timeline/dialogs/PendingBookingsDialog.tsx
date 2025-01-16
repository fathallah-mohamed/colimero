import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface PendingBookingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PendingBookingsDialog({ open, onOpenChange }: PendingBookingsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Réservations en attente
          </AlertDialogTitle>
          <AlertDialogDescription>
            Il y a des réservations en attente sur cette tournée. Vous devez confirmer ou annuler toutes les réservations en attente avant de démarrer le ramassage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}