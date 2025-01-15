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
      console.log("Attempting login with:", { email: email.trim() });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect");
          setShowErrorDialog(true);
        } else if (signInError.message === "Email not confirmed") {
          setShowVerificationDialog(true);
          
          // Send a new verification email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Error sending verification email:", resendError);
          }
        } else {
          setError("Une erreur est survenue lors de la connexion");
          setShowErrorDialog(true);
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

      // Check if email is verified for clients
      if (userType === 'client') {
        const { data: clientData } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', data.user.id)
          .single();

        if (clientData && !clientData.email_verified) {
          setShowVerificationDialog(true);
          // Send a new verification email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim(),
          });
          
          if (resendError) {
            console.error("Error sending verification email:", resendError);
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