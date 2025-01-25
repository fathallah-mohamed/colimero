import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ 
  onSuccess, 
  requiredUserType,
  onVerificationNeeded 
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    console.log("Starting login process for email:", email);
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      // Vérifier d'abord si le client existe et n'est pas vérifié
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("Client verification check:", { clientData, clientError });

      if (clientData && !clientData.email_verified) {
        console.log("Client found but not verified, sending activation email");
        
        const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
          body: { 
            email: email.trim(),
            resend: true
          }
        });

        if (functionError) {
          console.error("Error sending activation email:", functionError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'envoyer l'email d'activation"
          });
        } else {
          console.log("Activation email sent successfully");
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
        }
        return;
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = user.user_metadata?.user_type;
      console.log("User type check:", { userType, requiredUserType });

      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      console.log("Login successful, handling navigation");
      if (onSuccess) {
        onSuccess();
        return;
      }

      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate("/");
      }

    } catch (error: any) {
      console.error("Unexpected error during login:", error);
      setError("Une erreur inattendue s'est produite");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  };
}