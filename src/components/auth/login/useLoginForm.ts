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
      if (!email.trim() || !password.trim()) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      // Log attempt for debugging
      console.log("Tentative de connexion avec:", email.trim());

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        // Handle specific error cases
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect");
        } else if (signInError.message === "Email not confirmed") {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else if (signInError.message.includes("Invalid email")) {
          setError("Format d'email invalide");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Log successful login for debugging
      console.log("Connexion réussie, données utilisateur:", data.user);
      
      const userType = data.user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);

      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        setError(
          requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients. Les transporteurs ne peuvent pas réserver de tournées. Veuillez vous connecter avec un compte client."
            : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur."
        );
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      onSuccess?.();

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

    } catch (error: any) {
      console.error("Erreur complète:", error);
      setError("Une erreur est survenue lors de la connexion");
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