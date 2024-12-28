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
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError("Veuillez remplir tous les champs");
        setIsLoading(false);
        return;
      }

      console.log("Attempting login with:", { email: trimmedEmail });

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Handle specific error cases
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect. Pour les tests, utilisez: fakhri2@transport.com / password123");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setError(signInError.message);
        }
        return;
      }

      console.log("Login successful:", data);

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers la page d'accueil",
      });

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Une erreur est survenue lors de la connexion");
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
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

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

          {/* Add test credentials hint */}
          <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm text-blue-600">
            <p className="font-medium">Identifiants de test :</p>
            <p>Email : fakhri2@transport.com</p>
            <p>Mot de passe : password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}