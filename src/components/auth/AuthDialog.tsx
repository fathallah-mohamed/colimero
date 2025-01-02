import {
  Dialog,
  DialogContent,
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
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          {view === "login" ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  {requiredUserType === 'client'
                    ? "Connexion requise pour réserver"
                    : requiredUserType === 'carrier'
                    ? "Connexion requise pour créer une tournée"
                    : "Connexion"}
                </h2>
                <p className="text-gray-600">
                  {requiredUserType === 'client'
                    ? "Connectez-vous pour réserver cette tournée."
                    : requiredUserType === 'carrier'
                    ? "Connectez-vous pour créer une tournée."
                    : "Connectez-vous à votre compte."}
                </p>
              </div>
              {renderLoginForm()}
            </div>
          ) : view === "register" ? (
            <RegisterForm onLogin={() => setView("login")} />
          ) : (
            <div className="p-6">
              <ForgotPasswordForm
                onSuccess={() => setView("login")}
                onCancel={() => setView("login")}
              />
            </div>
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