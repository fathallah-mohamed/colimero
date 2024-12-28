import Navigation from "@/components/Navigation";
import { TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function PlanifierTournee() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"login" | "register" | "forgot-password">("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenus optimisés",
      description:
        "Maximisez vos profits en remplissant votre véhicule sur vos trajets existants.",
    },
    {
      icon: Users,
      title: "Réseau d'expéditeurs",
      description:
        "Accédez à une large base de clients vérifiés prêts à expédier.",
    },
    {
      icon: Shield,
      title: "Gestion simplifiée",
      description:
        "Gérez facilement vos tournées et vos clients via notre plateforme intuitive.",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers la création de tournée",
      });

      navigate("/planifier");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: "carrier",
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });
      
      setView("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte mail pour réinitialiser votre mot de passe",
      });
      
      setView("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0091FF] mb-6">
            Planifiez une tournée et connectez-vous à notre réseau d'expéditeurs !
          </h1>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Créez facilement une tournée pour vos trajets, remplissez votre
            véhicule et optimisez vos revenus. Grâce à Colimero, vous accédez à un
            large réseau d'expéditeurs prêts à collaborer.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-[#0091FF]/10 w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-[#0091FF]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-[#0091FF] hover:bg-[#0091FF]/90 text-white px-8"
            onClick={() => setIsLoginDialogOpen(true)}
          >
            Créer une tournée
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Vous devez être connecté pour planifier une tournée
          </p>
        </div>
      </div>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {view === "login" 
                ? "Connexion Transporteur" 
                : view === "register" 
                ? "Créer un compte transporteur"
                : "Réinitialiser le mot de passe"}
            </DialogTitle>
            <DialogDescription>
              {view === "login" 
                ? "Connectez-vous pour créer une tournée"
                : view === "register"
                ? "Créez votre compte transporteur pour commencer"
                : "Entrez votre email pour réinitialiser votre mot de passe"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={view === "login" ? handleLogin : view === "register" ? handleRegister : handleForgotPassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {view !== "forgot-password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : view === "login" 
                ? "Se connecter" 
                : view === "register" 
                ? "Créer le compte"
                : "Envoyer le lien"}
            </Button>
            
            <div className="flex justify-between text-sm text-blue-500">
              {view === "login" && (
                <>
                  <button 
                    type="button"
                    className="hover:underline" 
                    onClick={() => setView("forgot-password")}
                  >
                    Mot de passe oublié ?
                  </button>
                  <button 
                    type="button"
                    className="hover:underline"
                    onClick={() => setView("register")}
                  >
                    Créer un compte
                  </button>
                </>
              )}
              {view !== "login" && (
                <button 
                  type="button"
                  className="hover:underline"
                  onClick={() => setView("login")}
                >
                  Retour à la connexion
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}