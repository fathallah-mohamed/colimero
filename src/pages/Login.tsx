import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      if (session?.user) {
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { _event, session });
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log("Attempting login with email:", trimmedEmail);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      console.log("Auth response:", { data, error });

      if (error) throw error;
      if (!data?.user) throw new Error("Aucune donnée utilisateur reçue");

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers la page d'accueil",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      if (error.message === "Veuillez remplir tous les champs") {
        errorMessage = error.message;
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      }

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
                disabled={isLoading}
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
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-center">
            <button 
              onClick={() => navigate("/inscription")} 
              className="text-blue-500 hover:underline"
              disabled={isLoading}
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}