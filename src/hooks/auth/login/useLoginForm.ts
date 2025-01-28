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

  const checkCarrierStatus = async (email: string) => {
    console.log('Checking carrier status for:', email);
    const { data: carrierData, error: carrierError } = await supabase
      .from('carriers')
      .select('status, reason')
      .eq('email', email.trim())
      .maybeSingle();

    if (carrierError) {
      console.error("Error checking carrier status:", carrierError);
      return { isValid: false, error: "Une erreur est survenue lors de la vérification du compte" };
    }

    if (!carrierData) {
      return { isValid: false, error: "Aucun compte transporteur trouvé avec cet email" };
    }

    console.log('Carrier status:', carrierData.status);

    switch (carrierData.status) {
      case 'active':
        return { isValid: true };
      case 'pending':
        return { 
          isValid: false, 
          error: "Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois votre compte validé." 
        };
      case 'rejected':
        return { 
          isValid: false, 
          error: carrierData.reason || "Votre demande d'inscription a été rejetée. Vous ne pouvez pas vous connecter." 
        };
      default:
        return { 
          isValid: false, 
          error: "Statut de compte invalide. Veuillez contacter l'administrateur." 
        };
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // 1. Vérifier d'abord si c'est un compte admin
      const isAdmin = await checkAdminStatus(email);
      console.log('Is admin account:', isAdmin);

      if (!isAdmin && requiredUserType === 'carrier') {
        // 2. Si ce n'est pas un admin et qu'on exige un transporteur, vérifier le statut
        const carrierStatus = await checkCarrierStatus(email);
        console.log('Carrier status check result:', carrierStatus);
        
        if (!carrierStatus.isValid) {
          setError(carrierStatus.error);
          setShowErrorDialog(true);
          return;
        }
      }

      const result = await authService.signIn(email, password);
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