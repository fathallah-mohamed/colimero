import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface UncollectedBookingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UncollectedBookingsDialog({ open, onOpenChange }: UncollectedBookingsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Réservations non ramassées
          </AlertDialogTitle>
          <AlertDialogDescription>
            Il y a des réservations qui ne sont pas encore ramassées sur cette tournée. Vous devez ramasser ou annuler toutes les réservations avant de démarrer le transit.
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