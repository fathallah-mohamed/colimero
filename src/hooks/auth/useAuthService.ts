import { useState } from "react";
import { adminAuthService } from "@/services/auth/admin-auth-service";
import { carrierAuthService } from "@/services/auth/carrier-auth-service";
import { clientAuthService } from "@/services/auth/client-auth-service";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

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

      // Si un type d'utilisateur est requis, vérifier d'abord le statut pour les clients
      if (requiredUserType === 'client' || !requiredUserType) {
        const clientStatus = await checkClientVerification(email);
        console.log('Client status check result:', clientStatus);

        if (clientStatus && (!clientStatus.email_verified || clientStatus.status !== 'active')) {
          console.log('Client needs verification');
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }
      }

      // Si un type d'utilisateur est requis, on essaie uniquement ce service
      if (requiredUserType) {
        const service = {
          'admin': adminAuthService,
          'carrier': carrierAuthService,
          'client': clientAuthService
        }[requiredUserType];

        if (!service) {
          throw new Error(`Type d'utilisateur non supporté: ${requiredUserType}`);
        }

        const result = await service.signIn(email, password);
        if (result.needsVerification) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }
        handleAuthResult(result);
        return;
      }

      // Sinon, on essaie chaque service dans l'ordre
      const adminResult = await adminAuthService.signIn(email, password);
      if (adminResult.success) {
        handleAuthResult(adminResult, 'admin');
        return;
      }

      const carrierResult = await carrierAuthService.signIn(email, password);
      if (carrierResult.success) {
        handleAuthResult(carrierResult, 'carrier');
        return;
      }

      const clientResult = await clientAuthService.signIn(email, password);
      if (clientResult.success) {
        handleAuthResult(clientResult, 'client');
        return;
      }

      // Si aucun service n'a réussi
      if (clientResult.needsVerification) {
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      setError("Email ou mot de passe incorrect");

    } catch (error) {
      console.error('Login error:', error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthResult = (result: { success: boolean; error?: string }, userType?: string) => {
    if (result.success) {
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userType || ''}`
      });
      if (onSuccess) onSuccess();
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  };

  return {
    isLoading,
    error,
    handleLogin
  };
}