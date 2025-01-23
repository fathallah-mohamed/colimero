import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ActivationEmailSentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ActivationEmailSentDialog({
  open,
  onClose,
}: ActivationEmailSentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Email d'activation envoyé
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Un email d'activation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.
          </p>
          <Button onClick={onClose} className="w-full">
            J'ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}