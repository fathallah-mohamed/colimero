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
}

export function AuthDialog({
  open,
  onClose,
  requiredUserType,
  showTabs = false,
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
  };

  if (location.pathname.includes("/reserver/")) {
    sessionStorage.setItem("returnPath", location.pathname + location.search);
  }

  const onRegisterClick = () => {
    setShowRegisterForm(true);
  };

  const onCarrierRegisterClick = () => {
    setShowCarrierAuthDialog(true);
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
          onRegisterClick={onRegisterClick}
          onCarrierRegisterClick={onCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      ) : showTabs ? (
        <TabbedLoginView
          onRegisterClick={onRegisterClick}
          onCarrierRegisterClick={onCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      ) : (
        <SimpleLoginView
          onRegisterClick={onRegisterClick}
          onCarrierRegisterClick={onCarrierRegisterClick}
          handleSuccess={handleSuccess}
        />
      )}
    </Dialog>
  );
}