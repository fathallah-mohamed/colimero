import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type View = "login" | "register" | "forgot-password";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthDialog({ isOpen, onClose, onSuccess }: AuthDialogProps) {
  const [view, setView] = useState<View>("login");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {view === "login" ? "Connexion requise" : "Créer un compte client"}
            </DialogTitle>
          </div>
          <p className="text-lg text-gray-600">
            {view === "login" 
              ? "Connectez-vous pour réserver cette tournée."
              : "Créez votre compte client pour commencer à expédier vos colis"
            }
          </p>
        </DialogHeader>

        {view === "login" ? (
          <LoginForm
            onForgotPassword={() => setView("forgot-password")}
            onRegister={() => setView("register")}
            onSuccess={onSuccess}
          />
        ) : (
          <RegisterForm onLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}