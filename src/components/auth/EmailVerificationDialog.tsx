import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VerificationDialogContent } from "./verification/VerificationDialogContent";
import { ConfirmationDialog } from "./verification/ConfirmationDialog";
import { useVerificationEmail } from "@/hooks/auth/useVerificationEmail";
import { useToast } from "@/hooks/use-toast";
import { ActivationDialog } from "./activation/ActivationDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
          
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Votre compte n'est pas encore activé. Veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>.
            </p>

            <div className="flex flex-col gap-4">
              <Button
                onClick={() => setShowActivationDialog(true)}
                className="w-full bg-primary"
              >
                Entrer le code d'activation
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">ou</span>
                </div>
              </div>

              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={isResending}
              >
                {isResending ? "Envoi en cours..." : "Recevoir un nouveau code"}
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Le code d'activation est valable pendant 48 heures
            </p>
          </div>
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