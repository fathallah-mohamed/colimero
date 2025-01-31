import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // If it's a carrier login, check carrier status first
      if (requiredUserType === 'carrier') {
        const { data: carrierData, error: carrierError } = await supabase
          .from('carriers')
          .select('status')
          .eq('email', email.trim())
          .maybeSingle();

        if (carrierError) {
          console.error('Error checking carrier status:', carrierError);
          throw new Error("Une erreur est survenue");
        }

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

      // Proceed with login attempt
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Login error:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
          return { success: false, error: 'Email ou mot de passe incorrect' };
        }

        if (signInError.message.includes('Email not confirmed')) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return { success: false, needsVerification: true };
        }

        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (!session) {
        setError("Erreur de connexion");
        return { success: false, error: "Erreur de connexion" };
      }

      // Check user type if required
      if (requiredUserType && session.user.user_metadata?.user_type !== requiredUserType) {
        setError(`Email ou mot de passe incorrect`);
        await supabase.auth.signOut();
        return { success: false };
      }

      if (onSuccess) {
        onSuccess();
      }

      return { success: true };

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Une erreur est survenue");
      return { success: false, error: error.message };
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