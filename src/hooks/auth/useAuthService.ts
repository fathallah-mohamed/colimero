import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface UseAuthServiceProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
  requiredUserType?: UserType;
}

export function useAuthService({ 
  onSuccess, 
  onVerificationNeeded,
  requiredUserType 
}: UseAuthServiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkClientVerification = async (email: string) => {
    console.log('Checking client verification status for:', email);
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        throw clientError;
      }

      console.log('Client verification data:', clientData);
      return clientData;
    } catch (error) {
      console.error('Error in checkClientVerification:', error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);

      // Vérifier d'abord le statut du client
      if (!requiredUserType || requiredUserType === 'client') {
        try {
          const clientStatus = await checkClientVerification(email);
          console.log('Client status check result:', clientStatus);

          if (clientStatus && (!clientStatus.email_verified || clientStatus.status !== 'active')) {
            console.log('Client needs verification, triggering verification flow');
            if (onVerificationNeeded) {
              onVerificationNeeded();
            }
            return { success: false, needsVerification: true };
          }
        } catch (error) {
          console.error('Error checking client status:', error);
        }
      }

      // Tentative de connexion
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
          return { success: false, error: 'Email ou mot de passe incorrect' };
        }
        
        if (signInError.message.includes('Email not confirmed')) {
          console.log('Email not confirmed, triggering verification flow');
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return { success: false, needsVerification: true };
        }

        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier le type d'utilisateur si requis
      if (requiredUserType && user.user_metadata?.user_type !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        await supabase.auth.signOut();
        return { success: false, error: `Type de compte incorrect` };
      }

      if (onSuccess) {
        onSuccess();
      }

      return { success: true };

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur est survenue lors de la connexion");
      return { success: false, error: "Une erreur est survenue lors de la connexion" };
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