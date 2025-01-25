import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onVerificationNeeded?: () => void;
}

export function useLoginForm({ onSuccess, requiredUserType, onVerificationNeeded }: UseLoginFormProps = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const resetState = () => {
    setPassword("");
    setIsLoading(false);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setShowErrorDialog(true);
    setPassword("");
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    try {
      // Première étape : Vérifier les identifiants avec Supabase Auth
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        let errorMessage = "Une erreur est survenue lors de la connexion";
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }
        handleError(errorMessage);
        return;
      }

      if (!user) {
        handleError("Aucune donnée utilisateur reçue");
        return;
      }

      // Deuxième étape : Vérifier le type d'utilisateur et son statut
      const userType = user.user_metadata?.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        handleError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        await supabase.auth.signOut();
        return;
      }

      // Vérification spécifique selon le type d'utilisateur
      if (userType === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('id', user.id)
          .single();

        if (clientError || !clientData) {
          handleError("Erreur lors de la vérification du compte client");
          await supabase.auth.signOut();
          return;
        }

        if (!clientData.email_verified) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          setPassword("");
          setIsLoading(false);
          await supabase.auth.signOut();
          return;
        }
      } else if (userType === 'carrier') {
        const { data: carrierData, error: carrierError } = await supabase
          .from('carriers')
          .select('status')
          .eq('id', user.id)
          .single();

        if (carrierError || !carrierData) {
          handleError("Erreur lors de la vérification du compte transporteur");
          await supabase.auth.signOut();
          return;
        }

        if (carrierData.status !== 'active') {
          handleError("Votre compte transporteur n'est pas encore activé");
          await supabase.auth.signOut();
          return;
        }
      }

      // Si tout est OK, on procède à la connexion
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
      });

      setIsLoading(false);

      if (onSuccess) {
        onSuccess();
        return;
      }

      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        switch (userType) {
          case 'admin':
            navigate("/admin");
            break;
          case 'carrier':
            navigate("/mes-tournees");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Complete error:", error);
      handleError("Une erreur inattendue s'est produite");
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