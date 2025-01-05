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

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (signInError.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (signInError.message.includes("Invalid email")) {
          errorMessage = "Format d'email invalide";
        } else if (signInError.message.includes("Password")) {
          errorMessage = "Le mot de passe est incorrect";
        }

        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);

      // Vérification du type d'utilisateur requis
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        const errorMessage = requiredUserType === 'client' 
          ? "Cette fonctionnalité est réservée aux clients. Veuillez vous connecter avec un compte client."
          : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: errorMessage,
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      // Si onSuccess est fourni, l'appeler avant toute redirection
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirection selon le type d'utilisateur seulement si onSuccess n'est pas fourni
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
      console.error("Erreur complète:", error);
      setError("Une erreur inattendue est survenue");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de la connexion",
      });
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