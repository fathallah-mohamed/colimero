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
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    console.log('Client verification data:', clientData);
    return clientData;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);

      // Si c'est un client qui essaie de se connecter
      if (!requiredUserType || requiredUserType === 'client') {
        const clientStatus = await checkClientVerification(email);
        console.log('Client status check result:', clientStatus);

        if (clientStatus && (!clientStatus.email_verified || clientStatus.status !== 'active')) {
          console.log('Client needs verification');
          if (onVerificationNeeded) {
            onVerificationNeeded();
            return;
          }
        }
      }

      // Tentative de connexion
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
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
      setError(error.message || "Une erreur est survenue");
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