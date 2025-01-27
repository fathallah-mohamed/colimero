import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UseClientAuthProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onSuccess, onVerificationNeeded }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkClientStatus = async (email: string) => {
    try {
      console.log('Checking client status for:', email);
      const { data: clientData, error } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (error) {
        console.error("Error checking client status:", error);
        throw new Error("Une erreur est survenue lors de la vérification de votre compte");
      }

      return {
        isVerified: clientData?.email_verified ?? false,
        status: clientData?.status ?? 'pending',
        exists: clientData !== null
      };
    } catch (error) {
      console.error("Error in checkClientStatus:", error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier d'abord le statut du client
      const clientStatus = await checkClientStatus(email);
      
      if (!clientStatus.exists) {
        setError("Compte non trouvé");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucun compte trouvé avec cet email"
        });
        return;
      }

      if (!clientStatus.isVerified || clientStatus.status !== 'active') {
        console.log("Account needs verification:", email);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setError("Votre compte n'est pas activé. Veuillez vérifier votre email.");
        toast({
          variant: "destructive",
          title: "Compte non activé",
          description: "Veuillez activer votre compte via le code reçu par email."
        });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Email ou mot de passe incorrect");
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect"
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Une erreur inattendue s'est produite");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin
  };
}