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
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      // Vérifier d'abord le statut du client
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
        console.log('Client account needs verification:', email);
        setShowVerificationDialog(true);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return { success: false, needsVerification: true };
      }

      // Tentative de connexion
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error('Login error:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
          setShowErrorDialog(true);
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
        setShowErrorDialog(true);
        return { success: false, error: signInError.message };
      }

      if (!session) {
        setError("Erreur de connexion");
        setShowErrorDialog(true);
        return { success: false, error: "Erreur de connexion" };
      }

      // Vérifier le type d'utilisateur si requis
      if (requiredUserType && session.user.user_metadata?.user_type !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
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
      setShowErrorDialog(true);
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