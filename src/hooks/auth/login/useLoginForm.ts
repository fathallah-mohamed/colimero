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

  const handleActivationEmail = async (email: string) => {
    try {
      const { error: functionError } = await supabase.functions.invoke('send-activation-email', {
        body: { 
          email: email.trim(),
          resend: true
        }
      });

      if (functionError) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'envoyer l'email d'activation"
        });
        return false;
      }

      toast({
        title: "Email envoyé",
        description: "Un nouvel email d'activation vous a été envoyé"
      });
      return true;
    } catch (error) {
      console.error("Error sending activation email:", error);
      return false;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // 1. Vérifier d'abord si le client existe et son statut
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("Client verification status:", clientData);

      // 2. Si le client existe et n'est pas vérifié ou est en attente
      if (clientData && (!clientData.email_verified || clientData.status === 'pending')) {
        console.log("Account not verified or pending, blocking login");
        const emailSent = await handleActivationEmail(email);
        if (emailSent && onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
        return;
      }

      // 3. Tenter la connexion seulement si le compte est vérifié
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
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

      // Vérification du type d'utilisateur si requis
      const userType = user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        return;
      }

      // Navigation après connexion réussie
      if (onSuccess) {
        onSuccess();
      } else {
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
        } else {
          navigate("/");
        }
      }

    } catch (error: any) {
      console.error("Login error:", error);
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