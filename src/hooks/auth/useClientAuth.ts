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

      // If no client found, return default values
      if (!clientData) {
        return {
          isVerified: false,
          status: 'pending',
          exists: false
        };
      }

      return {
        isVerified: clientData.email_verified ?? false,
        status: clientData.status ?? 'pending',
        exists: true
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

      // First check if the client exists and their status
      const clientStatus = await checkClientStatus(email);
      
      if (!clientStatus.exists) {
        setError("Aucun compte trouvé avec cet email");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucun compte trouvé avec cet email"
        });
        return;
      }

      // Check if account is verified and active before attempting login
      if (!clientStatus.isVerified || clientStatus.status !== 'active') {
        console.log("Account needs verification:", email);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
        toast({
          variant: "destructive",
          title: "Compte non activé",
          description: "Veuillez activer votre compte via le code reçu par email."
        });
        return;
      }

      // Only attempt login if the client exists and is verified
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (signInError.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect";
        } else {
          errorMessage = "Une erreur est survenue lors de la connexion";
        }
        
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage
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