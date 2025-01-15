import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
  requiredUserType?: 'client' | 'carrier' | 'admin';
}

export function LoginForm({
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
  onForgotPasswordClick,
  requiredUserType,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Basic validation
      if (!trimmedEmail || !trimmedPassword) {
        toast({
          variant: "destructive",
          title: "Champs requis",
          description: "Veuillez remplir tous les champs",
        });
        setIsLoading(false);
        return;
      }

      // For client users, check if account is activated
      if (requiredUserType === 'client') {
        const { data: client } = await supabase
          .from('clients')
          .select('is_activated')
          .eq('email', trimmedEmail)
          .single();

        if (client && !client.is_activated) {
          toast({
            variant: "destructive",
            title: "Compte non activé",
            description: "Veuillez activer votre compte via le lien reçu par email avant de vous connecter.",
          });
          setIsLoading(false);
          return;
        }
      }

      // Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error("Détails de l'erreur d'authentification:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Format d'email invalide. Veuillez vérifier votre adresse email.";
        }

        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        setPassword("");
        return;
      }

      if (!data.user) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const userType = data.user.user_metadata?.user_type;

      if (requiredUserType && userType !== requiredUserType) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: `Cette section est réservée aux ${requiredUserType}s.`,
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      setPassword("");
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="exemple@email.com"
          className="w-full"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-sm text-[#00B0F0] hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <div className="space-y-4">
        {onRegisterClick && (
          <Button
            type="button"
            variant="outline"
            onClick={onRegisterClick}
            className="w-full"
            disabled={isLoading}
          >
            Créer un compte client
          </Button>
        )}
        
        {onCarrierRegisterClick && (
          <Button
            type="button"
            variant="outline"
            onClick={onCarrierRegisterClick}
            className="w-full"
            disabled={isLoading}
          >
            Devenir transporteur
          </Button>
        )}
      </div>
    </form>
  );
}