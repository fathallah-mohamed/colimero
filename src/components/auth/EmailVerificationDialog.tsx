import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  email,
}: EmailVerificationDialogProps) {
  const { isResending, resendActivationEmail } = useEmailVerification();

  const handleResendEmail = async () => {
    if (!email) return;
    const success = await resendActivationEmail(email);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} modal={true}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader className="relative">
          <DialogTitle>Email non vérifié</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <p className="text-lg text-gray-600">
          Votre compte n'a pas encore été activé. Veuillez vérifier votre boîte de réception et vos spams pour trouver l'email d'activation.
        </p>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fermer
          </Button>
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Renvoyer l'email d'activation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}