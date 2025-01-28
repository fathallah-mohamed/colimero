import { useState } from "react";
import { adminAuthService } from "@/services/auth/admin-auth-service";
import { carrierAuthService } from "@/services/auth/carrier-auth-service";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseAuthServiceProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useAuthService({ onSuccess, onVerificationNeeded }: UseAuthServiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Essayer d'abord la connexion admin
      const adminResult = await adminAuthService.signIn(email, password);
      if (adminResult.success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue administrateur"
        });
        if (onSuccess) onSuccess();
        return;
      }

      // Essayer ensuite la connexion transporteur
      const carrierResult = await carrierAuthService.signIn(email, password);
      if (carrierResult.success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue transporteur"
        });
        if (onSuccess) onSuccess();
        return;
      } else if (carrierResult.needsValidation) {
        await supabase.auth.signOut();
        setError(carrierResult.error);
        return;
      }

      // Enfin, essayer la connexion client
      const clientResult = await clientAuthService.signIn(email, password);
      if (clientResult.success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue client"
        });
        if (onSuccess) onSuccess();
        return;
      } else if (clientResult.needsVerification) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        await supabase.auth.signOut();
        setError(clientResult.error);
        return;
      }

      // Si aucune connexion n'a réussi
      setError("Email ou mot de passe incorrect");
      
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