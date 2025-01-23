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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      console.log("Attempting login with:", { email: email.trim() });
      
      // 1. Attempt login first
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      // Handle login errors
      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Handle invalid credentials specifically
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
          setShowErrorDialog(true);
          setPassword("");
          return;
        }

        // Handle other auth errors
        setError("Une erreur est survenue lors de la connexion");
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      // Check if we got user data back
      if (!data.user) {
        setError("Aucune donnée utilisateur reçue");
        setShowErrorDialog(true);
        return;
      }

      // 2. For clients, verify email status
      if (data.user.user_metadata?.user_type === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', data.user.id)
          .maybeSingle();

        if (clientError) {
          console.error("Error checking client:", clientError);
          setError("Une erreur est survenue lors de la vérification du compte");
          setShowErrorDialog(true);
          await supabase.auth.signOut();
          return;
        }

        // Show verification dialog if account exists but isn't verified
        if (clientData && !clientData.email_verified) {
          console.log("Account exists but not verified");
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setShowVerificationDialog(true);
          await supabase.auth.signOut();
          return;
        }
      }

      // 3. Check required user type if specified
      const userType = data.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      // 4. Success - show toast and handle navigation
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
          navigate("/");
        }
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur inattendue s'est produite");
      setShowErrorDialog(true);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  };
}