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
    setPassword(""); // Clear password for security
    console.log("Starting login attempt...");

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Veuillez remplir tous les champs");
      }

      console.log("Attempting login with Supabase...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Login error:", error);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message === "Email not confirmed") {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        throw new Error(errorMessage);
      }

      if (!data.user) {
        console.error("No user data received");
        throw new Error("Erreur lors de la connexion");
      }

      console.log("Login successful, user data:", data.user);
      const userType = data.user.user_metadata?.user_type;
      console.log("User type:", userType);

      // Redirect based on user type
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

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
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