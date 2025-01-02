import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { RegisterForm } from "./RegisterForm";
import CarrierAuthDialog from "./CarrierAuthDialog";
import { ClientLoginForm } from "./login/ClientLoginForm";
import { CarrierLoginForm } from "./login/CarrierLoginForm";
import { GeneralLoginForm } from "./login/GeneralLoginForm";

type View = "login" | "register" | "forgot-password";

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
  const [view, setView] = useState<View>("login");
  const [showCarrierDialog, setShowCarrierDialog] = useState(false);

  const handleRegisterClick = () => {
    if (requiredUserType === 'carrier' && onRegisterClick) {
      onRegisterClick();
    } else {
      setView("register");
    }
  };

  const handleCarrierRegisterClick = () => {
    onClose();
    setShowCarrierDialog(true);
  };

  const getDialogTitle = () => {
    if (view === "login") {
      if (requiredUserType === 'client') {
        return "Connexion requise pour réserver";
      } else if (requiredUserType === 'carrier') {
        return "Connexion requise pour créer une tournée";
      }
      return "Connexion";
    }
    return "Créer un compte client";
  };

  const getDialogDescription = () => {
    if (view === "login") {
      if (requiredUserType === 'client') {
        return "Connectez-vous pour réserver cette tournée.";
      } else if (requiredUserType === 'carrier') {
        return "Connectez-vous pour créer une tournée.";
      }
      return "Connectez-vous à votre compte.";
    }
    return "Créez votre compte client pour commencer à expédier vos colis";
  };

  const renderLoginForm = () => {
    if (requiredUserType === 'client') {
      return (
        <ClientLoginForm
          onForgotPassword={() => setView("forgot-password")}
          onRegister={handleRegisterClick}
          onSuccess={onSuccess}
        />
      );
    } else if (requiredUserType === 'carrier') {
      return (
        <CarrierLoginForm
          onForgotPassword={() => setView("forgot-password")}
          onCarrierRegister={handleCarrierRegisterClick}
          onSuccess={onSuccess}
        />
      );
    }
    return (
      <GeneralLoginForm
        onForgotPassword={() => setView("forgot-password")}
        onRegister={handleRegisterClick}
        onCarrierRegister={handleCarrierRegisterClick}
        onSuccess={onSuccess}
      />
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">
                {getDialogTitle()}
              </DialogTitle>
            </div>
            <p className="text-lg text-gray-600">
              {getDialogDescription()}
            </p>
          </DialogHeader>

          {view === "login" ? (
            renderLoginForm()
          ) : view === "register" ? (
            <RegisterForm onLogin={() => setView("login")} />
          ) : (
            <ForgotPasswordForm
              onSuccess={() => setView("login")}
              onCancel={() => setView("login")}
            />
          )}
        </DialogContent>
      </Dialog>

      <CarrierAuthDialog 
        isOpen={showCarrierDialog} 
        onClose={() => setShowCarrierDialog(false)} 
      />
    </>
  );
}