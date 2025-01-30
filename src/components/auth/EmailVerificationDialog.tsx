import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { clientAuthService } from "@/services/auth/client-auth-service";

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
  const [activationCode, setActivationCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setError(null);
      console.log("Resending activation email to:", email);

      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email,
          resend: true
        }
      });

      if (emailError) {
        console.error("Error sending activation email:", emailError);
        throw emailError;
      }

      console.log("Activation email sent successfully");
      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email."
      });

    } catch (error) {
      console.error('Error resending email:', error);
      setError("Impossible d'envoyer l'email d'activation. Veuillez réessayer plus tard.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email d'activation. Veuillez réessayer plus tard."
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleActivate = async () => {
    if (!activationCode) {
      setError("Veuillez saisir le code d'activation");
      return;
    }

    try {
      setIsActivating(true);
      setError(null);

      const result = await clientAuthService.activateAccount(activationCode, email);
      
      if (!result.success) {
        setError(result.error || "Code d'activation invalide");
        return;
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });
      onClose();

    } catch (error) {
      console.error('Error activating account:', error);
      setError("Une erreur est survenue lors de l'activation");
    } finally {
      setIsActivating(false);
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
            Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail à l'adresse <span className="font-medium">{email}</span> et saisir le code reçu ci-dessous.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Code d'activation"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleActivate}
              disabled={isActivating || !activationCode}
              className="w-full"
            >
              {isActivating ? "Activation..." : "Activer mon compte"}
            </Button>

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