import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailVerificationDialog({
  isOpen,
  onClose,
  email
}: EmailVerificationDialogProps) {
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setError(null);

      const { error: resendError } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (resendError) {
        throw resendError;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email."
      });

    } catch (error) {
      console.error('Error resending email:', error);
      setError("Impossible d'envoyer l'email d'activation. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vérification de l'email requise</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail à l'adresse <span className="font-medium">{email}</span> et suivre les instructions pour activer votre compte.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
            >
              {isResending ? "Envoi en cours..." : "Renvoyer l'email d'activation"}
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}