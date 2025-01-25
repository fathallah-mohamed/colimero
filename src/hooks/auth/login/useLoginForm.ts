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
    try {
      console.log("Starting login process for:", email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // Vérifier d'abord si le client existe et son statut de vérification
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      console.log("Client verification check:", { clientData, clientError });

      // Si le client existe et n'est pas vérifié, bloquer la connexion
      if (clientData && !clientData.email_verified) {
        console.log("Client found but not verified, sending activation email");
        
        // Envoyer un nouvel email d'activation
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
          toast({
            title: "Email envoyé",
            description: "Un nouvel email d'activation vous a été envoyé"
          });
        }

        // Afficher le dialogue de vérification
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setShowVerificationDialog(true);
        setIsLoading(false);
        return;
      }

      // Si le client n'existe pas ou est vérifié, procéder à la connexion
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
        setIsLoading(false);
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérification du type d'utilisateur
      const userType = user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        setIsLoading(false);
        return;
      }

      // Double vérification finale du statut de vérification
      if (userType === 'client') {
        const { data: verifiedCheck } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', user.id)
          .single();

        if (!verifiedCheck?.email_verified) {
          console.log("Final verification check failed, signing out");
          await supabase.auth.signOut();
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setShowVerificationDialog(true);
          setIsLoading(false);
          return;
        }
      }

      // Succès de la connexion
      console.log("Login successful, handling navigation");
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