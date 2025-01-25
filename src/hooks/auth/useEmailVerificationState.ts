import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useEmailVerificationState(email: string) {
  const [isResending, setIsResending] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    try {
      console.log('Attempting to resend activation email to:', email);
      setIsResending(true);

      const { error } = await supabase.functions.invoke('send-activation-email', {
        body: { email }
      });

      if (error) {
        console.error('Error sending activation email:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi de l'email.",
        });
        return;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouveau lien d'activation a été envoyé à votre adresse email.",
      });

      // Log success for debugging
      console.log('Activation email sent successfully to:', email);

    } catch (error) {
      console.error('Error in handleResendEmail:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    showVerificationDialog,
    setShowVerificationDialog,
    handleResendEmail
  };
}