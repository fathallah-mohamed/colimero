import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm(onSuccess?: () => void) {
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
      console.log("Tentative de connexion pour:", email.trim());

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        switch (signInError.message) {
          case "Invalid login credentials":
            errorMessage = "Email ou mot de passe incorrect";
            break;
          case "Email not confirmed":
            errorMessage = "Veuillez confirmer votre email avant de vous connecter";
            break;
          case "Invalid email":
            errorMessage = "Format d'email invalide";
            break;
        }
        
        setError(errorMessage);
        setPassword("");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier si l'utilisateur est un admin
      const { data: adminData } = await supabase
        .from('administrators')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminData) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace administrateur",
        });
        navigate("/admin");
        onSuccess?.();
        return;
      }

      const userType = data.user.user_metadata?.user_type;
      console.log("Type d'utilisateur:", userType);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      switch (userType) {
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