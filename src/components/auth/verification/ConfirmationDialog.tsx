import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function ConfirmationDialog({ open, onClose }: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <AlertDialogTitle className="text-center">
            Email envoyé avec succès
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Un nouveau lien d'activation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} variant="default">
            Fermer
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}