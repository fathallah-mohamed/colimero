import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginViewProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onSuccess?: () => void;
}

export function LoginView({ onForgotPassword, onRegister, onSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with email:", email);

      if (!email.trim() || !password.trim()) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou mot de passe incorrect");
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Une erreur est survenue lors de la connexion");
      }

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Login error:", error);
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
    <form onSubmit={handleLogin} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white"
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
          className="bg-white"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Se connecter"}
      </Button>

      <div className="flex justify-between text-sm text-[#00B0F0]">
        <button
          type="button"
          className="hover:underline"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
        <button
          type="button"
          className="hover:underline"
          onClick={onRegister}
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
}