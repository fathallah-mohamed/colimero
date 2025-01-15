import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  redirectTo?: string;
}

export function useLoginForm(props?: UseLoginFormProps) {
  const { onSuccess, requiredUserType, redirectTo } = props || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowErrorDialog(false);
    setShowVerificationDialog(false);

    try {
      // Vérifier d'abord si l'email est vérifié pour les clients
      if (requiredUserType === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('email', email.trim())
          .maybeSingle();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error('Error fetching client:', clientError);
          throw new Error("Une erreur est survenue lors de la vérification de votre compte");
        }

        if (!clientData?.email_verified) {
          setShowVerificationDialog(true);
          setIsLoading(false);
          // Déconnexion immédiate si déjà connecté
          await supabase.auth.signOut();
          return;
        }
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect");
          setShowErrorDialog(true);
          return;
        } else if (signInError.message === "Email not confirmed") {
          setShowVerificationDialog(true);
          return;
        }
        throw signInError;
      }

      if (!signInData.user) {
        throw new Error("Erreur lors de la connexion");
      }

      const userType = signInData.user.user_metadata?.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        return;
      }

      // Vérification supplémentaire après la connexion pour les clients
      if (userType === 'client') {
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', signInData.user.id)
          .single();

        if (clientError) {
          console.error('Error fetching client after signin:', clientError);
          await supabase.auth.signOut();
          throw new Error("Une erreur est survenue lors de la vérification de votre compte");
        }

        if (!client?.email_verified) {
          await supabase.auth.signOut();
          setShowVerificationDialog(true);
          setIsLoading(false);
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
        return;
      }

      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
        return;
      }

      if (redirectTo) {
        navigate(redirectTo);
      } else {
        switch (userType) {
          case 'carrier':
            navigate("/mes-tournees");
            break;
          case 'admin':
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Complete error:", error);
      setError(error.message);
      setShowErrorDialog(true);
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