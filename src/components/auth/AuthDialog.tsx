import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

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
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <DialogTitle className="text-2xl font-bold">
              {showForgotPassword
                ? "Réinitialisation du mot de passe"
                : "Connexion"}
            </DialogTitle>
            <DialogClose onClick={onClose} className="hover:bg-gray-100 rounded-full p-2">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>

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
                onForgotPassword={() => setShowForgotPassword(true)}
                onRegister={onRegisterClick}
                onCarrierRegister={onCarrierRegisterClick}
                requiredUserType={requiredUserType}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}