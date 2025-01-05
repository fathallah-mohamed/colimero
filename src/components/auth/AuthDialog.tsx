import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export default function AuthDialog({ 
  isOpen, 
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
}: AuthDialogProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">Connexion</DialogTitle>
        <div className="space-y-6">
          <LoginForm
            onForgotPassword={() => {}}
            onRegister={onRegisterClick}
            onCarrierRegister={onCarrierRegisterClick}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}