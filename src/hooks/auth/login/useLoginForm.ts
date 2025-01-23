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
      // 1. Tenter d'abord la connexion
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      // Si erreur de connexion
      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Si c'est une erreur d'identifiants invalides
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect");
          setShowErrorDialog(true);
          setPassword("");
          return;
        }

        // Pour toute autre erreur
        setError("Une erreur est survenue lors de la connexion");
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      // Si pas d'utilisateur retourné
      if (!data.user) {
        setError("Aucune donnée utilisateur reçue");
        setShowErrorDialog(true);
        return;
      }

      // 2. Vérifier si le compte est activé (seulement pour les clients)
      if (data.user.user_metadata?.user_type === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', data.user.id)
          .single();

        if (clientError) {
          console.error("Error checking client:", clientError);
          setError("Une erreur est survenue lors de la vérification du compte");
          setShowErrorDialog(true);
          return;
        }

        // Si le compte existe mais n'est pas activé
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

      // 3. Vérifier le type d'utilisateur si requis
      const userType = data.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

      // 4. Succès de la connexion
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
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