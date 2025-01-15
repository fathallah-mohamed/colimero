import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      console.log("Tentative de connexion avec:", { email, password });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur de connexion:", signInError);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
          setShowErrorDialog(true);
        } else if (signInError.message === "Email not confirmed") {
          setShowVerificationDialog(true);
          // Envoyer un nouvel email d'activation
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Erreur lors de l'envoi de l'email:", resendError);
          }
          
          errorMessage = "Veuillez vérifier votre email pour activer votre compte. Un nouvel email d'activation vient d'être envoyé.";
        }

        setError(errorMessage);
        setPassword("");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);

      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Vérifier si l'email est vérifié pour les clients
      if (userType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', data.user.id)
          .single();

        if (clientData && !clientData.email_verified) {
          setShowVerificationDialog(true);
          // Envoyer un nouvel email d'activation
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Erreur lors de l'envoi de l'email:", resendError);
          }
          
          setError("Veuillez vérifier votre email pour activer votre compte. Un nouvel email d'activation vient d'être envoyé.");
          await supabase.auth.signOut();
          setIsLoading(false);
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
      console.error("Erreur complète:", error);
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