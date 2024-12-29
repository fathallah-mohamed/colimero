import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onForgotPassword, onRegister, onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        let errorMessage = "Email ou mot de passe incorrect";
        if (error.message === "Email not confirmed") {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        setPassword("");
        return;
      }

      if (session?.user) {
        const userType = session.user.user_metadata?.user_type;
        
        if (userType === 'carrier') {
          navigate("/mes-tournees");
        } else if (userType === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
      });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="flex justify-between text-sm">
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onRegister}
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
}