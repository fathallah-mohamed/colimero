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
  requiredUserType?: 'client' | 'carrier' | 'admin';
}

export function LoginForm({
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
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
      if (!email.trim() || !password.trim()) {
        toast({
          variant: "destructive",
          title: "Champs requis",
          description: "Veuillez remplir tous les champs",
        });
        return;
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        let errorTitle = "Erreur de connexion";
        let errorMessage = "Une erreur est survenue lors de la connexion";

        if (signInError.message === "Invalid login credentials") {
          errorTitle = "Identifiants incorrects";
          errorMessage = "L'email ou le mot de passe est incorrect";
        } else if (signInError.message.includes("Email not confirmed")) {
          errorTitle = "Email non confirmé";
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (signInError.message.includes("Invalid email")) {
          errorTitle = "Email invalide";
          errorMessage = "Le format de l'email est incorrect";
        } else if (signInError.message.includes("Password")) {
          errorTitle = "Mot de passe incorrect";
          errorMessage = "Le mot de passe fourni est incorrect";
        }

        toast({
          variant: "destructive",
          title: errorTitle,
          description: errorMessage,
        });
        setPassword("");
        return;
      }

      if (user) {
        const userType = user.user_metadata?.user_type;

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
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
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
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      <div className="space-y-4">
        {onRegisterClick && (
          <Button
            type="button"
            variant="outline"
            onClick={onRegisterClick}
            className="w-full"
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
          >
            Devenir transporteur
          </Button>
        )}
      </div>
    </form>
  );
}