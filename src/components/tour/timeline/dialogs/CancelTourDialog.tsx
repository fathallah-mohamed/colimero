import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface CancelTourDialogProps {
  onCancel: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelTourDialog({ onCancel, open, onOpenChange }: CancelTourDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirmer l'annulation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}