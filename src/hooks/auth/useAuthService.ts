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

          // Si le client existe et n'est pas vérifié/actif
          if (clientStatus && (!clientStatus.email_verified || clientStatus.status !== 'active')) {
            console.log('Client needs verification');
            if (onVerificationNeeded) {
              onVerificationNeeded();
              return { success: false, needsVerification: true };
            }
          }

          // Si le client n'existe pas, on continue avec la connexion
          // car il sera créé automatiquement par le trigger
          if (!clientStatus) {
            console.log('No client profile found, will be created by trigger');
          }

        } catch (error) {
          console.error('Error checking client status:', error);
          // On continue avec la tentative de connexion même si la vérification échoue
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
        
        // Si l'erreur est liée à la vérification de l'email pour un client
        if (signInError.message.includes('Email not confirmed') && (!requiredUserType || requiredUserType === 'client')) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
            return { success: false, needsVerification: true };
          }
        }

        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier le type d'utilisateur si requis
      const userType = user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        await supabase.auth.signOut();
        return { success: false, error: `Type de compte incorrect` };
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      }

      return { success: true };

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
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