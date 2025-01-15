import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

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
      // Vérifier d'abord si l'email est vérifié pour les clients
      if (requiredUserType === 'client') {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('email_verified')
          .eq('email', email.trim())
          .single();

        if (clientError) {
          console.error("Erreur lors de la vérification du client:", clientError);
          throw new Error("Une erreur est survenue lors de la vérification de votre compte");
        }

        if (!clientData?.email_verified) {
          setError("Veuillez vérifier votre email avant de vous connecter");
          toast({
            variant: "destructive",
            title: "Email non vérifié",
            description: "Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception et vos spams.",
          });
          setIsLoading(false);
          return;
        }
      }

      const response = await authenticateUser(email, password);
      
      if (response.success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });

        if (onSuccess) {
          onSuccess();
          return;
        }

        const returnPath = sessionStorage.getItem('returnPath');
        if (returnPath) {
          sessionStorage.removeItem('returnPath');
          navigate(returnPath);
          return;
        }

        if (redirectTo) {
          navigate(redirectTo);
        } else {
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