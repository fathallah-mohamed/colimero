import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseClientLoginProps {
  onSuccess?: () => void;
  onVerificationNeeded?: () => void;
}

export function useClientLogin({ onSuccess, onVerificationNeeded }: UseClientLoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    console.log('Starting login process for:', email);
    setIsLoading(true);
    setError(null);

    try {
      // Vérifier d'abord si le client existe et n'est pas vérifié
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      console.log('Client verification status:', clientData);

      if (clientError) {
        console.error('Error checking client:', clientError);
        setError("Une erreur est survenue lors de la vérification du compte");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du compte"
        });
        return;
      }

      // Si le client existe et n'est pas vérifié, bloquer la connexion
      if (clientData && clientData.email_verified === false) {
        console.log('Client found but not verified, triggering verification needed');
        setError("Veuillez activer votre compte via le lien envoyé par email avant de vous connecter");
        toast({
          variant: "destructive",
          title: "Compte non activé",
          description: "Veuillez activer votre compte via le lien envoyé par email avant de vous connecter"
        });
        if (onVerificationNeeded) {
          onVerificationNeeded();
        }
        return;
      }

      // Procéder à la connexion uniquement si le compte est vérifié
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Email ou mot de passe incorrect"
          });
        } else {
          setError("Une erreur est survenue lors de la connexion");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la connexion"
          });
        }
        return;
      }

      if (!user) {
        console.error('No user data received');
        setError("Aucune donnée utilisateur reçue");
        return;
      }

      console.log('Login successful');
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur inattendue s'est produite");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
  };
}