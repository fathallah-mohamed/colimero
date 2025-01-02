import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm(onSuccess?: () => void, requiredUserType?: 'client' | 'carrier' | 'admin') {
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
      console.log("Tentative de connexion pour:", email.trim());

      // Clear any existing session first
      await supabase.auth.signOut();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error("Erreur d'authentification:", signInError);
        
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect");
        } else if (signInError.message === "Email not confirmed") {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      // Vérifier le type d'utilisateur requis
      const userType = data.user.user_metadata?.user_type;
      if (requiredUserType && userType !== requiredUserType) {
        setError(`Ce formulaire est réservé aux ${requiredUserType}s`);
        await supabase.auth.signOut();
        return;
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