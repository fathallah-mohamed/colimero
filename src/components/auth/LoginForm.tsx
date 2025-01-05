import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
}: LoginFormProps) {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Erreur lors de la connexion");
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      const userType = data.user.user_metadata?.user_type;
      
      onSuccess?.();

      // Redirection selon le type d'utilisateur
      switch (userType) {
        case 'admin':
          navigate("/admin");
          break;
        case 'carrier':
          navigate("/mes-tournees");
          break;
        default:
          const returnPath = sessionStorage.getItem('returnPath');
          if (returnPath) {
            sessionStorage.removeItem('returnPath');
            navigate(returnPath);
          } else {
            navigate("/");
          }
      }
    } catch (error: any) {
      console.error("Erreur complète:", error);
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message === "Email not confirmed") {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      }

      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          required
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

      <div className="space-y-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onRegister}
          className="w-full"
        >
          Créer un compte client
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCarrierRegister}
          className="w-full"
        >
          Devenir transporteur
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-[#00B0F0] hover:underline"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
}