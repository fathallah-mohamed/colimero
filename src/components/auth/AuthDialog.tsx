import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export function AuthDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  requiredUserType,
  onRegisterClick,
  onCarrierRegisterClick 
}: AuthDialogProps) {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    onClose();
    navigate("/reset-password");
  };

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      onClose();
      navigate("/inscription");
    }
  };

  const handleCarrierRegister = () => {
    if (onCarrierRegisterClick) {
      onCarrierRegisterClick();
    } else {
      onClose();
      navigate("/devenir-transporteur");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-6">
          <LoginForm 
            onSuccess={onSuccess}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
            onCarrierRegister={handleCarrierRegister}
            requiredUserType={requiredUserType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}