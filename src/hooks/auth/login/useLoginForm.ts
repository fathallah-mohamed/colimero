import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function useLoginForm({ onSuccess, requiredUserType }: UseLoginFormProps = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error details:", {
      message: error.message,
      status: error instanceof AuthApiError ? error.status : null,
      name: error.name
    });
    
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case "Invalid login credentials":
          return "Email ou mot de passe incorrect";
        case "Email not confirmed":
          setShowVerificationDialog(true);
          return "Veuillez vérifier votre email pour activer votre compte";
        case "Invalid email or password":
          return "Email ou mot de passe invalide";
        default:
          return `Erreur d'authentification: ${error.message}`;
      }
    }
    return "Une erreur inattendue s'est produite";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      console.log("Attempting login with:", { email: email.trim() });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        const errorMessage = handleAuthError(signInError);
        setError(errorMessage);
        setShowErrorDialog(true);

        if (signInError.message === "Email not confirmed") {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Error sending verification email:", resendError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible d'envoyer l'email de vérification",
            });
          } else {
            toast({
              title: "Email envoyé",
              description: "Un nouvel email de vérification vous a été envoyé",
            });
          }
        }
        
        setPassword("");
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("User type:", userType);

      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      if (userType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', data.user.id)
          .single();

        if (clientData && !clientData.email_verified) {
          setShowVerificationDialog(true);
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Error sending verification email:", resendError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible d'envoyer l'email de vérification",
            });
          } else {
            toast({
              title: "Email envoyé",
              description: "Un nouvel email de vérification vous a été envoyé",
            });
          }
          
          await supabase.auth.signOut();
          return;
        }
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        switch (userType) {
          case 'admin':
            navigate("/admin");
            break;
          case 'carrier':
            navigate("/mes-tournees");
            break;
          default:
            const returnPath = sessionStorage.getItem('returnPath');
            if (returnPath) {
              sessionStorage.removeItem('returnPath');
              navigate(returnPath);
            } else {
              navigate("/");
            }
        }
      }
    } catch (error: any) {
      console.error("Complete error:", error);
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