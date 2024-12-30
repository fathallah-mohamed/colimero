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
      // Validation basique
      if (!email.trim()) {
        throw new Error("L'adresse email est requise");
      }

      if (!password.trim()) {
        throw new Error("Le mot de passe est requis");
      }

      // Tentative d'authentification
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        // Gestion détaillée des erreurs d'authentification
        switch (signInError.message) {
          case "Invalid login credentials":
            throw new Error("L'email ou le mot de passe est incorrect. Veuillez vérifier vos identifiants.");
          case "Email not confirmed":
            throw new Error("Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation.");
          case "Invalid email":
            throw new Error("Le format de l'email est invalide. Veuillez entrer une adresse email valide.");
          case "Too many requests":
            throw new Error("Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer.");
          case "Server error":
            throw new Error("Une erreur serveur est survenue. Veuillez réessayer plus tard.");
          default:
            throw new Error("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        }
      }

      if (!data.user) {
        throw new Error("Une erreur inattendue est survenue lors de la connexion");
      }

      const userType = data.user.user_metadata?.user_type;

      // Vérification du type d'utilisateur requis
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
      console.error("Erreur de connexion:", error);
      setError(error.message);
      setPassword(""); // Effacer le mot de passe en cas d'erreur
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