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
      if (!email.trim()) {
        throw new Error("L'adresse email est requise");
      }

      if (!password.trim()) {
        throw new Error("Le mot de passe est requis");
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (signInError) {
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        switch (signInError.message) {
          case "Invalid login credentials":
            errorMessage = "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.";
            break;
          case "Email not confirmed":
            errorMessage = "Votre compte n'est pas encore activé. Veuillez vérifier votre boîte mail.";
            break;
          case "Invalid email":
            errorMessage = "Format d'email invalide. Veuillez entrer une adresse email valide.";
            break;
          case "Too many requests":
            errorMessage = "Trop de tentatives de connexion. Veuillez patienter quelques minutes.";
            break;
          default:
            console.error("Erreur de connexion:", signInError);
        }
        
        setError(errorMessage);
        setPassword("");
        return;
      }

      if (!data.user) {
        throw new Error("Une erreur est survenue lors de la connexion");
      }

      const userType = data.user.user_metadata?.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        throw new Error(
          requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients"
            : "Cette fonctionnalité est réservée aux transporteurs"
        );
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
      setError(error.message);
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