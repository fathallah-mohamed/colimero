import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CarrierSignupForm from "./CarrierSignupForm";

type View = "login" | "register" | "forgot-password";

export default function CarrierAuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>("login");
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

      // First, attempt to sign in
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Sign in response:", { user, error: signInError });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Email ou mot de passe incorrect");
        }
        throw signInError;
      }

      if (!user) {
        throw new Error("Une erreur est survenue lors de la connexion");
      }

      // Check if user is a carrier
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log("Carrier check response:", { carrierData, error: carrierError });

      if (carrierError || !carrierData) {
        // If not a carrier, sign out and show error
        await supabase.auth.signOut();
        throw new Error("Ce compte n'est pas un compte transporteur");
      }

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers la création de tournée",
      });

      onClose();
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description:
          "Veuillez vérifier votre boîte mail pour réinitialiser votre mot de passe",
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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

        {view === "register" ? (
          <CarrierSignupForm onSuccess={() => setView("login")} />
        ) : (
          <form
            onSubmit={view === "login" ? handleLogin : handleForgotPassword}
            className="space-y-4 py-4"
          >
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
            {view === "login" && (
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
            )}
            <Button
              type="submit"
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
              disabled={isLoading}
            >
              {isLoading
                ? "Chargement..."
                : view === "login"
                ? "Se connecter"
                : "Envoyer le lien"}
            </Button>

            <div className="flex justify-between text-sm text-[#00B0F0]">
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
        )}
      </DialogContent>
    </Dialog>
  );
}