import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      console.log('Client status data:', clientData);
      
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
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);

      // 1. Vérifier d'abord le statut du client
      const clientStatus = await checkClientStatus(email);
      console.log('Client status check result:', clientStatus);
      
      if (!clientStatus.exists) {
        console.log('No client account found for:', email);
        setError("Aucun compte trouvé avec cet email");
        return;
      }

      // 2. Si le compte n'est pas vérifié ou actif, déclencher le processus de vérification
      if (!clientStatus.isVerified || clientStatus.status !== 'active') {
        console.log('Client account needs verification:', email);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      // 3. Si le compte est vérifié et actif, procéder à la connexion
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        if (signInError.message === 'Email not confirmed') {
          // Si l'email n'est pas confirmé, on déclenche la vérification sans afficher d'erreur
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }
        setError("Email ou mot de passe incorrect");
        return;
      }

      if (!session) {
        setError("Erreur de connexion");
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Une erreur inattendue s'est produite");
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