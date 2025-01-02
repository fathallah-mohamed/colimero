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
      setError("Veuillez saisir votre adresse email");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Veuillez saisir votre mot de passe");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentative de connexion pour:", email.trim());

      // Clear any existing session first
      await supabase.auth.signOut();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        switch (signInError.message) {
          case "Invalid login credentials":
            setError("Email ou mot de passe incorrect. Veuillez vérifier vos identifiants et réessayer.");
            break;
          case "Email not confirmed":
            setError("Votre email n'a pas été confirmé. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation.");
            break;
          case "Invalid email":
            setError("Format d'email invalide. Veuillez vérifier votre adresse email.");
            break;
          default:
            setError("Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.");
        }
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

      console.log("Résultat de la vérification admin:", adminData);

      if (adminData) {
        console.log("Utilisateur admin trouvé");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace administrateur",
        });
        navigate("/admin");
        onSuccess?.();
        return;
      }

      // Si ce n'est pas un admin, vérifier le type d'utilisateur normal
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
        case 'client':
          navigate("/mes-reservations");
          break;
        default:
          navigate("/");
      }

      onSuccess?.();

    } catch (error: any) {
      console.error("Erreur complète:", error);
      setError("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
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