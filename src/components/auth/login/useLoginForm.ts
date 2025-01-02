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

  const validateInputs = () => {
    if (!email.trim()) {
      setError("L'adresse email est requise");
      return false;
    }

    if (!password.trim()) {
      setError("Le mot de passe est requis");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentative de connexion pour:", email.trim());
      console.log("Tentative d'authentification avec Supabase...");

      const { data: { user, session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Veuillez vérifier votre email et mot de passe");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
        setPassword("");
        return;
      }

      if (!user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);

      // Vérification du type d'utilisateur requis
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(
          requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients. Veuillez vous connecter avec un compte client."
            : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur."
        );
        return;
      }

      console.log("Connexion réussie pour l'utilisateur:", user.email);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      // Redirection selon le type d'utilisateur
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
      setError("Une erreur inattendue est survenue");
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