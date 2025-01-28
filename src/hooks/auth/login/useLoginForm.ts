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

  const checkAdminStatus = async (email: string) => {
    console.log('Checking admin status for:', email);
    const { data: adminData, error: adminError } = await supabase
      .from('administrators')
      .select('id')
      .eq('email', normalizeEmail(email))
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
      .eq('email', normalizeEmail(email))
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

  const determineUserType = async (email: string) => {
    const normalizedEmail = normalizeEmail(email);
    
    // Vérifier d'abord si c'est un admin
    const isAdmin = await checkAdminStatus(normalizedEmail);
    if (isAdmin) return 'admin';

    // Vérifier ensuite si c'est un transporteur
    const { data: carrier } = await supabase
      .from('carriers')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (carrier) return 'carrier';

    // Vérifier enfin si c'est un client
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (client) return 'client';

    return null;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      const normalizedEmail = normalizeEmail(email);

      // 1. Déterminer le type d'utilisateur
      const userType = await determineUserType(normalizedEmail);
      console.log('Determined user type:', userType);

      if (!userType) {
        setError("Aucun compte trouvé avec cet email");
        setShowErrorDialog(true);
        return;
      }

      // 2. Vérifier si le type d'utilisateur correspond au type requis
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${
          requiredUserType === 'client' ? 'client' : 
          requiredUserType === 'carrier' ? 'transporteur' : 
          'administrateur'
        }`);
        setShowErrorDialog(true);
        return;
      }

      // 3. Vérifier le statut selon le type d'utilisateur
      switch (userType) {
        case 'admin':
          // Les admins n'ont pas besoin de vérification supplémentaire
          break;

        case 'carrier':
          const carrierStatus = await checkCarrierStatus(normalizedEmail);
          if (!carrierStatus.isValid) {
            setError(carrierStatus.error);
            setShowErrorDialog(true);
            return;
          }
          break;

        case 'client':
          const clientStatus = await checkClientStatus(normalizedEmail);
          if (!clientStatus.isValid) {
            if (clientStatus.needsVerification) {
              setShowVerificationDialog(true);
              if (onVerificationNeeded) {
                onVerificationNeeded(normalizedEmail);
              }
            }
            setError(clientStatus.error);
            if (!clientStatus.needsVerification) {
              setShowErrorDialog(true);
            }
            return;
          }
          break;
      }

      // 4. Tenter la connexion
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