import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

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
          <div className="mx-auto mb-4 bg-blue-50 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            Activation de votre compte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-gray-600">
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
              className="w-full"
            >
              {isResending ? "Envoi en cours..." : "Renvoyer l'email d'activation"}
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Fermer
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}