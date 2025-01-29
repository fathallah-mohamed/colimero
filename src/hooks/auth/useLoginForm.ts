import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";

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

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowVerificationDialog(false);
      setShowErrorDialog(false);

      console.log('Checking client status for:', email);
      
      // 1. Check client status first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (clientError) {
        console.error('Error checking client status:', clientError);
        throw new Error("Erreur lors de la vérification du compte");
      }

      // 2. If client exists but is not verified, show verification dialog
      if (clientData && (!clientData.email_verified || clientData.status !== 'active')) {
        console.log('Client needs verification:', clientData);
        setShowVerificationDialog(true);
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      // 3. Attempt login
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (signInError.message.includes('Email not confirmed')) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // 4. Check user type if required
      const userType = user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      // 5. Success handling
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