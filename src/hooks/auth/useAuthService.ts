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

      // Si c'est un client qui essaie de se connecter
      if (!requiredUserType || requiredUserType === 'client') {
        try {
          const clientStatus = await checkClientVerification(email);
          console.log('Client status check result:', clientStatus);

          if (clientStatus && (!clientStatus.email_verified || clientStatus.status !== 'active')) {
            console.log('Client needs verification');
            if (onVerificationNeeded) {
              onVerificationNeeded();
              return;
            }
          }
        } catch (error) {
          console.error('Error checking client status:', error);
          // Continue with login attempt even if verification check fails
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
          return;
        }
        
        // Si l'erreur est liée à la vérification de l'email pour un client
        if (signInError.message.includes('Email not confirmed') && (!requiredUserType || requiredUserType === 'client')) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
            return;
          }
        }

        setError(signInError.message);
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier le type d'utilisateur si requis
      const userType = user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        await supabase.auth.signOut();
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
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