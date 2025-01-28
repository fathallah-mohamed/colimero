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

  const checkAdminStatus = async (email: string) => {
    console.log('Checking admin status for:', email);
    const { data: adminData, error: adminError } = await supabase
      .from('administrators')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (adminError) {
      console.error("Error checking admin status:", adminError);
      return false;
    }

    return !!adminData;
  };

  const checkClientVerification = async (email: string) => {
    console.log('Checking client verification status for:', email);
    const { data: clientData } = await supabase
      .from('clients')
      .select('email_verified, status')
      .eq('email', email.trim())
      .maybeSingle();

    console.log('Client verification data:', clientData);
    return {
      isVerified: clientData?.email_verified ?? false,
      status: clientData?.status ?? 'pending'
    };
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // Vérifier d'abord si c'est un compte admin
      const isAdmin = await checkAdminStatus(email);
      console.log('Is admin account:', isAdmin);

      // Si ce n'est pas un admin et qu'on n'exige pas un type spécifique ou qu'on exige un client
      if (!isAdmin && (!requiredUserType || requiredUserType === 'client')) {
        const { isVerified, status } = await checkClientVerification(email);
        console.log('Verification status:', { isVerified, status });
        
        if (!isVerified || status !== 'active') {
          console.log("Account needs verification");
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded(email);
          }
          setError("Votre compte n'est pas activé. Veuillez vérifier votre email pour le code d'activation.");
          return;
        }
      }

      const result = await authService.signIn(email, password, requiredUserType);
      console.log('Sign in result:', result);

      if (!result.success) {
        if (result.needsVerification) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded(email);
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