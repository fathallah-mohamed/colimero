import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { clientAuthService } from "@/services/auth/client-auth-service";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail: () => void;
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  onResendEmail
}: EmailVerificationDialogProps) {
  const [activationCode, setActivationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode) return;

    setIsSubmitting(true);
    try {
      const result = await clientAuthService.activateAccount(activationCode, email);
      
      if (result.success) {
        toast({
          title: "Compte activé",
          description: "Votre compte a été activé avec succès",
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Code d'activation invalide",
        });
      }
    } catch (error) {
      console.error("Error activating account:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé",
      });
    } catch (error) {
      console.error("Error resending activation email:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le code d'activation",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Activation du compte
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-gray-600">
            Veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>.
          </p>

          <div className="space-y-4">
            <Input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Code d'activation"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !activationCode}
            >
              {isSubmitting ? "Activation..." : "Activer mon compte"}
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
              type="button"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}