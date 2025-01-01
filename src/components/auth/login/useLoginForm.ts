import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function useLoginForm({ onSuccess, requiredUserType }: UseLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (!user) throw new Error("Aucun utilisateur trouvé");

      const userType = user.user_metadata.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        throw new Error(
          requiredUserType === 'carrier'
            ? "Vous devez être connecté en tant que transporteur pour accéder à cette fonctionnalité"
            : "Vous devez être connecté en tant que client pour accéder à cette fonctionnalité"
        );
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: err instanceof Error ? err.message : "Une erreur est survenue",
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