import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";

interface UseAuthProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
}

export function useAuth({ 
  onSuccess,
  requiredUserType,
  onVerificationNeeded 
}: UseAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier le statut du client si nécessaire
      if (!requiredUserType || requiredUserType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified, status')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return { success: false, needsVerification: true };
        }
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        const errorMessage = signInError.message.includes('Invalid login credentials')
          ? "Email ou mot de passe incorrect"
          : "Une erreur est survenue lors de la connexion";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier le type d'utilisateur si requis
      if (requiredUserType && user.user_metadata?.user_type !== requiredUserType) {
        const errorMessage = `Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`;
        setError(errorMessage);
        await supabase.auth.signOut();
        return { success: false, error: errorMessage };
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
        } else {
          navigate('/');
        }
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      return { success: false, error: errorMessage };
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