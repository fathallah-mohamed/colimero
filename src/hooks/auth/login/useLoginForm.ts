import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth/auth-service";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: (email: string) => void;
}

export function useLoginForm({ 
  onSuccess,
  requiredUserType,
  onVerificationNeeded
}: UseLoginFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const checkClientStatus = async (email: string) => {
    console.log('Checking client status for:', email);
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', normalizeEmail(email))
      .maybeSingle();

    if (clientError) {
      console.error("Error checking client status:", clientError);
      return { isValid: false, error: "Une erreur est survenue lors de la vérification du compte" };
    }

    if (!clientData) {
      return { isValid: false, error: "Aucun compte client trouvé avec cet email" };
    }

    console.log('Client verification data:', clientData);

    if (!clientData.email_verified || clientData.status !== 'active') {
      return {
        isValid: false,
        needsVerification: true,
        error: "Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation."
      };
    }

    return { isValid: true };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      const normalizedEmail = normalizeEmail(email);

      // Vérifier d'abord le statut du client
      if (requiredUserType === 'client' || !requiredUserType) {
        const clientStatus = await checkClientStatus(normalizedEmail);
        console.log('Client status check result:', clientStatus);

        if (clientStatus.needsVerification) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded(normalizedEmail);
          }
          setError(clientStatus.error);
          return;
        }

        if (!clientStatus.isValid && clientStatus.error) {
          setError(clientStatus.error);
          setShowErrorDialog(true);
          return;
        }
      }

      // Tenter la connexion
      const result = await authService.signIn(normalizedEmail, password);
      console.log('Sign in result:', result);

      if (!result.success) {
        setError(result.error || "Une erreur est survenue");
        setShowErrorDialog(true);
        return;
      }

      // Ne pas rediriger si le dialogue de vérification est affiché
      if (!showVerificationDialog) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
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
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Une erreur est survenue");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  };
}