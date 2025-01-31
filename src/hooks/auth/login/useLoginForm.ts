import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // Si c'est un transporteur, vérifier d'abord son statut
      if (requiredUserType === 'carrier') {
        const { data: carrierData, error: carrierError } = await supabase
          .from('carriers')
          .select('status, email')
          .eq('email', email.trim())
          .maybeSingle();

        if (carrierError) {
          console.error('Error checking carrier status:', carrierError);
          setError("Une erreur est survenue");
          return { success: false };
        }

        // Si le transporteur existe, vérifier son statut
        if (carrierData) {
          if (carrierData.status === 'pending') {
            setError("Votre demande est en cours de validation. Vous recevrez un email une fois votre compte validé.");
            return { success: false };
          } else if (carrierData.status === 'rejected') {
            setError("Votre demande d'inscription a été rejetée");
            return { success: false };
          }
        }
      }

      // Procéder à la tentative de connexion
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Login error:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
          return { success: false };
        }

        if (signInError.message.includes('Email not confirmed')) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setShowVerificationDialog(true);
          return { success: false, needsVerification: true };
        }

        setError(signInError.message);
        return { success: false };
      }

      if (!session) {
        setError("Erreur de connexion");
        return { success: false };
      }

      // Vérifier le type d'utilisateur si requis
      if (requiredUserType && session.user.user_metadata?.user_type !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        await supabase.auth.signOut();
        return { success: false };
      }

      // Connexion réussie
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
      console.error("Login error:", error);
      setError(error.message || "Une erreur est survenue");
      return { success: false };
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