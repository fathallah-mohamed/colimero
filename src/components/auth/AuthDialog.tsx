import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">Connexion</DialogTitle>
        <LoginForm
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
          onRegisterClick={onRegisterClick}
          onCarrierRegisterClick={onCarrierRegisterClick}
        />
      </DialogContent>
    </Dialog>
  );
}