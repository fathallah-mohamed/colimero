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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowVerificationDialog(false);
    setShowErrorDialog(false);

    try {
      // Vérifier d'abord le type d'utilisateur si requis
      if (requiredUserType) {
        let userExists = false;
        let isVerified = false;

        if (requiredUserType === 'client') {
          const { data: clientData } = await supabase
            .from('clients')
            .select('email_verified')
            .eq('email', email.trim())
            .single();

          userExists = !!clientData;
          isVerified = clientData?.email_verified || false;
        } else if (requiredUserType === 'carrier') {
          const { data: carrierData } = await supabase
            .from('carriers')
            .select('status, email_verified')
            .eq('email', email.trim())
            .single();

          userExists = !!carrierData;
          isVerified = carrierData?.status === 'active';
        }

        if (!userExists) {
          setError(`Aucun compte ${requiredUserType === 'client' ? 'client' : 'transporteur'} trouvé avec cet email`);
          setShowErrorDialog(true);
          setPassword("");
          return;
        }

        if (!isVerified) {
          setShowVerificationDialog(true);
          if (onVerificationNeeded) {
            onVerificationNeeded();
          }
          return;
        }
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }

        setError(errorMessage);
        setShowErrorDialog(true);
        setPassword("");
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = user.user_metadata?.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce compte n'est pas un compte ${requiredUserType === 'client' ? 'client' : 'transporteur'}`);
        setShowErrorDialog(true);
        await supabase.auth.signOut();
        return;
      }

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

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
      });

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