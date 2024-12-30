import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm(onSuccess?: () => void, requiredUserType?: 'client' | 'carrier') {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation des champs
    if (!email.trim()) {
      setError("L'adresse email est requise");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Le mot de passe est requis");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentative de connexion avec:", email);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message.includes("Invalid login credentials") || 
            signInError.message.includes("invalid_credentials")) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (signInError.message.includes("Invalid email")) {
          errorMessage = "Format d'email invalide";
        }

        setError(errorMessage);
        setPassword("");
        setIsLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Une erreur est survenue lors de la connexion");
        setIsLoading(false);
        return;
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);

      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(
          requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients"
            : "Cette fonctionnalité est réservée aux transporteurs"
        );
        setIsLoading(false);
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

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

      onSuccess?.();

    } catch (error: any) {
      console.error("Erreur complète:", error);
      setError("Une erreur est survenue lors de la connexion");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}