import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccountActivation } from "@/hooks/auth/useAccountActivation";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { VerificationDialogHeader } from "./verification/VerificationDialogHeader";
import { VerificationCodeInput } from "./verification/VerificationCodeInput";
import { VerificationActions } from "./verification/VerificationActions";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  email,
}: EmailVerificationDialogProps) {
  const [activationCode, setActivationCode] = useState("");
  const { isLoading, error, sendActivationEmail, activateAccount } = useAccountActivation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode) {
      toast({
        variant: "destructive",
        title: "Code manquant",
        description: "Veuillez entrer le code d'activation reçu par email.",
      });
      return;
    }

    const success = await activateAccount(activationCode.trim(), email.trim());
    if (success) {
      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
      });
      onClose();
      navigate('/connexion');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email manquant",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
      return;
    }

    const success = await sendActivationEmail(email.trim());
    if (success) {
      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email.",
      });
      setActivationCode("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <VerificationDialogHeader />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-gray-600">
            Pour activer votre compte, veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <VerificationCodeInput
            value={activationCode}
            onChange={setActivationCode}
            isLoading={isLoading}
          />

          <VerificationActions
            isLoading={isLoading}
            activationCode={activationCode}
            onResendEmail={handleResendEmail}
          />

          <p className="text-sm text-gray-500 text-center">
            Le code d'activation est valable pendant 48 heures
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}