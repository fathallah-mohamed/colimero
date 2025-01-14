import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";
import { Button } from "../ui/button";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({
  open,
  onOpenChange,
}: AuthDialogProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showForgotPassword
              ? "Réinitialisation du mot de passe"
              : "Connexion"}
          </DialogTitle>
        </DialogHeader>

        {showForgotPassword ? (
          <div className="space-y-4">
            <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowForgotPassword(false)}
            >
              Retour à la connexion
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <LoginForm
              onSuccess={() => onOpenChange(false)}
              onForgotPasswordClick={() => setShowForgotPassword(true)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}