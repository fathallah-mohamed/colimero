import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth/auth-service";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: UserType;
  onVerificationNeeded?: () => void;
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

  const checkClientVerification = async (email: string) => {
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    return {
      isVerified: clientData?.email_verified ?? false,
      status: clientData?.status ?? 'pending'
    };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // Vérifier d'abord le statut du client
      if (!requiredUserType || requiredUserType === 'client') {
        const { isVerified, status } = await checkClientVerification(email);
        
        if (!isVerified || status !== 'active') {
          console.log("Account needs verification:", email);
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
          return;
        }
      }

      const result = await authService.signIn(email, password, requiredUserType);

      if (!result.success) {
        if (result.needsVerification) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
        }
        setError(result.error || "Une erreur est survenue");
        setShowErrorDialog(!result.needsVerification);
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