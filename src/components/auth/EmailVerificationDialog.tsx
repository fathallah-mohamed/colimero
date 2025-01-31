import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { VerificationAlert } from "./verification/VerificationAlert";
import { VerificationInput } from "./verification/VerificationInput";
import { VerificationButtons } from "./verification/VerificationButtons";

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
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState("");
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      setError(null);
      console.log("Requesting new activation code for:", email);

      const { data, error: dbError } = await supabase
        .rpc('generate_new_activation_code', {
          p_email: email
        });

      const result = data?.[0];
      if (dbError || !result?.success) {
        throw new Error(dbError?.message || result?.message || "Erreur lors de la génération du code");
      }

      const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email,
          resend: true
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Email envoyé",
        description: "Un nouveau code d'activation vous a été envoyé par email."
      });

    } catch (error: any) {
      console.error('Error in handleResendEmail:', error);
      setError("Impossible d'envoyer l'email d'activation. Veuillez réessayer plus tard.");
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

      const { data, error: validationError } = await supabase
        .rpc('validate_activation_code', {
          p_email: email,
          p_code: activationCode
        });

      if (validationError) throw validationError;

      const result = data?.[0];
      if (!result?.is_valid) {
        setError(result?.message || "Code d'activation invalide");
        return;
      }

      const { data: clientData } = await supabase
        .from('clients')
        .select('first_name, last_name')
        .eq('email', email)
        .single();

      const clientName = clientData ? `${clientData.first_name} ${clientData.last_name}` : "Nouveau client";

      const { error: emailError } = await supabase.functions.invoke('send-client-activation-emails', {
        body: { 
          clientEmail: email,
          clientName: clientName
        }
      });

      if (emailError) {
        console.error("Error sending confirmation emails:", emailError);
      }

      toast({
        title: "Compte activé",
        description: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter."
      });
      
      onClose();

    } catch (error: any) {
      console.error('Error in handleActivate:', error);
      setError("Une erreur est survenue lors de l'activation. Veuillez réessayer.");
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
          <VerificationAlert email={email} error={error} />
          
          <VerificationInput 
            value={activationCode}
            onChange={setActivationCode}
          />

          <VerificationButtons
            isActivating={isActivating}
            isResending={isResending}
            onActivate={handleActivate}
            onResendEmail={handleResendEmail}
            onClose={onClose}
            activationCode={activationCode}
          />

          <p className="text-sm text-gray-500 text-center">
            Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}