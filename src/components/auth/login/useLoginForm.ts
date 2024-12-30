import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Erreur d'authentification:", error);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        }
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

      if (requiredUserType && userType !== requiredUserType) {
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: requiredUserType === 'client' 
            ? "Cette fonctionnalité est réservée aux clients. Les transporteurs ne peuvent pas réserver de tournées. Veuillez vous connecter avec un compte client."
            : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur.",
          duration: 5000,
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      onSuccess?.();

    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
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