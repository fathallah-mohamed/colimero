import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LoginViewProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onSuccess: () => void;
  hideRegister?: boolean;
}

export function LoginView({ onForgotPassword, onRegister, onSuccess, hideRegister = false }: LoginViewProps) {
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
        } else if (error.message === "Email not confirmed") {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Format d'email invalide";
        } else if (error.message.includes("Password")) {
          errorMessage = "Le mot de passe est incorrect";
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
      console.log("Type d'utilisateur:", userType);

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      switch (userType) {
        case 'admin':
          navigate("/admin");
          break;
        case 'carrier':
          navigate("/mes-tournees");
          break;
        default:
          navigate("/");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Erreur complète:", error);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#00B0F0]/90"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      <div className={`flex ${hideRegister ? 'justify-center' : 'justify-between'} text-sm text-[#00B0F0]`}>
        <button
          type="button"
          className="hover:underline"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
        {!hideRegister && (
          <button
            type="button"
            className="hover:underline"
            onClick={onRegister}
          >
            Créer un compte
          </button>
        )}
      </div>
    </form>
  );
}