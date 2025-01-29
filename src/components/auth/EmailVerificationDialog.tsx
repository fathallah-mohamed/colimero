import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useAccountActivation } from "@/hooks/auth/useAccountActivation";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { VerificationDialogHeader } from "./verification/VerificationDialogHeader";
import { VerificationForm } from "./verification/VerificationForm";

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
        <VerificationForm
          email={email}
          error={error}
          isLoading={isLoading}
          activationCode={activationCode}
          onActivationCodeChange={setActivationCode}
          onSubmit={handleSubmit}
          onResendEmail={handleResendEmail}
        />
      </DialogContent>
    </Dialog>
  );
}