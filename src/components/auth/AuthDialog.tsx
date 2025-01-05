import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";

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
          requiredUserType={requiredUserType}
        />
      </DialogContent>
    </Dialog>
  );
}