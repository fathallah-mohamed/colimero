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

    try {
      // Basic validation
      if (!email.trim()) {
        throw new Error("L'adresse email est requise");
      }

      if (!password.trim()) {
        throw new Error("Le mot de passe est requis");
      }

      // Attempt authentication
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        switch (signInError.message) {
          case "Invalid login credentials":
            throw new Error("Email ou mot de passe incorrect");
          case "Email not confirmed":
            throw new Error("Veuillez confirmer votre email avant de vous connecter");
          case "Invalid email":
            throw new Error("Format d'email invalide");
          default:
            throw new Error("Une erreur est survenue lors de la connexion");
        }
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;

      // Check required user type
      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(
          requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients. Veuillez vous connecter avec un compte client."
            : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur."
        );
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      // Redirect based on user type
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
      setError(error.message || "Une erreur inattendue est survenue");
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