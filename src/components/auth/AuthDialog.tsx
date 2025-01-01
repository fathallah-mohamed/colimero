import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
}

export default function AuthDialog({ 
  isOpen, 
  onClose, 
  onSuccess, 
  requiredUserType,
  onRegisterClick 
}: AuthDialogProps) {
  const location = useLocation();
  const isBookingFlow = location.pathname.includes("/tours");
  const isCreateTourFlow = location.pathname.includes("/planifier-une-tournee");

  const getDialogTitle = () => {
    if (isBookingFlow) {
      return "Connexion requise pour réserver";
    }
    if (isCreateTourFlow) {
      return "Connexion requise pour créer une tournée";
    }
    return "Connexion";
  };

  const getDialogDescription = () => {
    if (isBookingFlow) {
      return "Connectez-vous pour réserver cette tournée";
    }
    if (isCreateTourFlow) {
      return "Connectez-vous en tant que transporteur pour créer une tournée";
    }
    return "Connectez-vous à votre compte";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <LoginForm 
          onSuccess={onSuccess} 
          requiredUserType={requiredUserType}
          onRegisterClick={onRegisterClick}
          isBookingFlow={isBookingFlow}
          isCreateTourFlow={isCreateTourFlow}
        />
      </DialogContent>
    </Dialog>
  );
}