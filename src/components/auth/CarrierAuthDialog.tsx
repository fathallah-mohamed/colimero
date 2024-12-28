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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers la création de tournée",
      });

      onClose();
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
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading
                ? "Chargement..."
                : view === "login"
                ? "Se connecter"
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
        )}
      </DialogContent>
    </Dialog>
  );
}