import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UseLoginFormProps {
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

  const checkEmailVerification = async (email: string, userType: string) => {
    if (userType === 'client') {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .single();

      if (clientError) {
        console.error("Error checking client verification:", clientError);
        return { error: "Une erreur est survenue lors de la vérification de votre compte." };
      }

      if (!clientData?.email_verified) {
        return { error: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter." };
      }
    }

    return { success: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      console.log("Attempting login with email:", email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        
        if (signInError.message.includes("Email not confirmed")) {
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setShowVerificationDialog(true);
          setPassword("");
          return;
        }

        let errorMessage = "Une erreur est survenue lors de la connexion";
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("User type:", userType, "Required type:", requiredUserType);

      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      // Vérifier la validation de l'email pour les clients
      if (userType === 'client') {
        const verificationResult = await checkEmailVerification(email, userType);
        if ('error' in verificationResult) {
          setError(verificationResult.error);
          setShowVerificationDialog(true);
          await supabase.auth.signOut();
          return;
        }
      }

      // Success
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
      console.error("Complete login error:", error);
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