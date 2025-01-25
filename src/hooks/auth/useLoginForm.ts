import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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
      // Vérifier d'abord si le client existe et n'est pas vérifié
      const { data: clientData } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .single();

      if (clientData && !clientData.email_verified) {
        console.log('Client trouvé mais non vérifié, envoi du mail d\'activation');
        
        // Appeler la fonction d'envoi d'email d'activation
        const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
          body: { email: email.trim() }
        });

        if (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'envoyer l'email d'activation"
          });
        } else {
          console.log('Email d\'activation envoyé avec succès');
        }

        setShowVerificationDialog(true);
        setPassword("");
        setIsLoading(false);
        return;
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