import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UseClientAuthProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientAuth({ onSuccess, onVerificationNeeded }: UseClientAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Attempt sign in first to handle the email_not_confirmed error
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Check if it's an email confirmation error
        if (signInError.message.includes("Email not confirmed")) {
          console.log('Email not confirmed, showing verification dialog');
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
          return;
        }
        
        // For any other error
        setError("Email ou mot de passe incorrect");
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