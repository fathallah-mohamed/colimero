import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import CarrierSignupForm from "./CarrierSignupForm";
import { LoginView } from "./carrier-auth/LoginView";

type View = "login" | "register" | "forgot-password";

export default function CarrierAuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>("login");

  // Reset view to login when dialog opens
  useEffect(() => {
    if (isOpen) {
      setView("login");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {view === "login"
              ? "Connexion"
              : view === "register"
              ? "Créer un compte"
              : "Réinitialiser le mot de passe"}
          </DialogTitle>
          <DialogDescription>
            {view === "login"
              ? "Connectez-vous pour accéder à votre compte"
              : view === "register"
              ? "Créez votre compte pour commencer"
              : "Entrez votre email pour réinitialiser votre mot de passe"}
          </DialogDescription>
        </DialogHeader>

        {view === "register" ? (
          <CarrierSignupForm onSuccess={() => setView("login")} />
        ) : (
          <LoginView
            onForgotPassword={() => setView("forgot-password")}
            onRegister={() => setView("register")}
            onSuccess={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}