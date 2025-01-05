import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/utils/auth";

export interface UseLoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  redirectTo?: string;
}

export function useLoginForm(props?: UseLoginFormProps) {
  const { onSuccess, requiredUserType, redirectTo } = props || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticateUser(email, password);
      
      if (response.success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });

        // Si onSuccess est fourni, l'appeler
        if (onSuccess) {
          onSuccess();
        }

        // Si un redirectTo est spécifié, l'utiliser
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          // Sinon, utiliser la redirection par défaut basée sur le type d'utilisateur
          if (response.redirectTo) {
            navigate(response.redirectTo);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
}