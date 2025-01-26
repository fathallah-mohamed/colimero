import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VerificationDialogContent } from "./verification/VerificationDialogContent";
import { ConfirmationDialog } from "./verification/ConfirmationDialog";
import { useVerificationEmail } from "@/hooks/auth/useVerificationEmail";
import { useToast } from "@/hooks/use-toast";
import { ActivationDialog } from "./activation/ActivationDialog";
import { useState } from "react";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  showConfirmationDialog?: boolean;
  onConfirmationClose?: () => void;
  onResendEmail: () => void;
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  showConfirmationDialog = false,
  onConfirmationClose,
  onResendEmail
}: EmailVerificationDialogProps) {
  const { isResending, sendVerificationEmail } = useVerificationEmail();
  const { toast } = useToast();
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  const handleResendEmail = async () => {
    try {
      const success = await sendVerificationEmail(email);
      if (success) {
        toast({
          title: "Email envoyé",
          description: "Un nouvel email d'activation vous a été envoyé",
        });
        onResendEmail();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer l'email d'activation",
        });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Compte non activé
            </DialogTitle>
          </DialogHeader>
          
          <VerificationDialogContent
            email={email}
            isResending={isResending}
            onResendEmail={handleResendEmail}
            onActivate={() => setShowActivationDialog(true)}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog 
        open={showConfirmationDialog} 
        onClose={onConfirmationClose}
      />

      <ActivationDialog
        isOpen={showActivationDialog}
        onClose={() => setShowActivationDialog(false)}
        email={email}
        onSuccess={onClose}
      />
    </>
  );
}