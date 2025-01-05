import { useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import { CarrierAuthDialog } from "./CarrierAuthDialog";
import { RegisterForm } from "./RegisterForm";
import { useState } from "react";
import { SimpleLoginView } from "./login/SimpleLoginView";
import { TabbedLoginView } from "./login/TabbedLoginView";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  requiredUserType?: "client" | "carrier";
  showTabs?: boolean;
  onSuccess?: () => void;
  fromHeader?: boolean;
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export function AuthDialog({
  open,
  onClose,
  requiredUserType,
  showTabs = false,
  onSuccess,
  fromHeader,
  onRegisterClick,
  onCarrierRegisterClick,
}: AuthDialogProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCarrierAuthDialog, setShowCarrierAuthDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    const returnPath = sessionStorage.getItem("returnPath");
    if (returnPath) {
      sessionStorage.removeItem("returnPath");
      navigate(returnPath);
    }
    onClose();
    onSuccess?.();
  };

  if (location.pathname.includes("/reserver/")) {
    sessionStorage.setItem("returnPath", location.pathname + location.search);
  }

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      setShowRegisterForm(true);
    }
  };

  const handleCarrierRegisterClick = () => {
    if (onCarrierRegisterClick) {
      onCarrierRegisterClick();
    } else {
      setShowCarrierAuthDialog(true);
    }
  };

  if (showCarrierAuthDialog) {
    return (
      <CarrierAuthDialog
        open={open}
        onClose={() => {
          setShowCarrierAuthDialog(false);
          onClose();
        }}
      />
    );
  }

  if (showRegisterForm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <RegisterForm
          onSuccess={handleSuccess}
          onBack={() => setShowRegisterForm(false)}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {requiredUserType ? (
        <SimpleLoginView
          requiredUserType={requiredUserType}
          onRegisterClick={handleRegisterClick}
          onCarrierRegisterClick={handleCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      ) : showTabs ? (
        <TabbedLoginView
          onRegisterClick={handleRegisterClick}
          onCarrierRegisterClick={handleCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      ) : (
        <SimpleLoginView
          onRegisterClick={handleRegisterClick}
          onCarrierRegisterClick={handleCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      )}
    </Dialog>
  );
}