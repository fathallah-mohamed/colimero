import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type View = "login" | "forgot-password";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthDialog({ isOpen, onClose, onSuccess }: AuthDialogProps) {
  const [view, setView] = useState<View>("login");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {view === "login"
              ? "Connexion"
              : "Réinitialiser le mot de passe"}
          </DialogTitle>
          <DialogDescription>
            {view === "login"
              ? "Connectez-vous pour accéder à votre compte"
              : "Entrez votre email pour réinitialiser votre mot de passe"}
          </DialogDescription>
        </DialogHeader>

        {view === "login" ? (
          <LoginForm
            onSuccess={() => {
              onSuccess?.();
              onClose();
            }}
            onForgotPassword={() => setView("forgot-password")}
          />
        ) : (
          <ForgotPasswordForm
            onSuccess={() => setView("login")}
            onCancel={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}