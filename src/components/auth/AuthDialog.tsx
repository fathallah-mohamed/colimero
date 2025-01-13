import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  requiredUserType?: 'client' | 'carrier' | 'admin';
}

export default function AuthDialog({ 
  isOpen, 
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
  requiredUserType
}: AuthDialogProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">
          {showForgotPassword ? "Réinitialisation du mot de passe" : "Connexion requise"}
        </DialogTitle>
        
        {showForgotPassword ? (
          <ForgotPasswordForm
            onSuccess={() => {
              setShowForgotPassword(false);
              onClose();
            }}
            onCancel={() => setShowForgotPassword(false)}
          />
        ) : (
          <LoginForm
            onSuccess={() => {
              onSuccess?.();
              onClose();
            }}
            onRegisterClick={onRegisterClick}
            onCarrierRegisterClick={onCarrierRegisterClick}
            onForgotPasswordClick={() => setShowForgotPassword(true)}
            requiredUserType={requiredUserType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}