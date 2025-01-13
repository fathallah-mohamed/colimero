import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./login/LoginForm";
import { ForgotPasswordForm } from "./forgot-password/ForgotPasswordForm";
import { useState } from "react";
import { Button } from "../ui/button";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  requiredUserType?: "client" | "carrier";
}

export default function AuthDialog({
  isOpen,
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
  requiredUserType,
}: AuthDialogProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onSuccess={onSuccess}
              onForgotPasswordClick={() => setShowForgotPassword(true)}
              requiredUserType={requiredUserType}
            />
            <div className="flex flex-col gap-2">
              {onRegisterClick && (
                <Button
                  variant="outline"
                  onClick={onRegisterClick}
                  className="w-full"
                >
                  Créer un compte client
                </Button>
              )}
              {onCarrierRegisterClick && (
                <Button
                  variant="outline"
                  onClick={onCarrierRegisterClick}
                  className="w-full"
                >
                  Devenir transporteur
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}