import { useLocation } from "react-router-dom";
import { SimpleAuthDialog } from "./dialog/SimpleAuthDialog";
import { RequiredUserAuthDialog } from "./dialog/RequiredUserAuthDialog";
import { TabsAuthDialog } from "./dialog/TabsAuthDialog";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
  fromHeader?: boolean;
}

export default function AuthDialog({ 
  isOpen, 
  onClose, 
  defaultTab = "client",
  onSuccess,
  requiredUserType,
  onRegisterClick,
  onCarrierRegisterClick,
  fromHeader = false
}: AuthDialogProps) {
  const location = useLocation();

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  // Sauvegarder le chemin actuel si on est sur une page de réservation
  if (location.pathname.includes('/reserver/')) {
    sessionStorage.setItem('returnPath', location.pathname + location.search);
  }

  // Si appelé depuis le header, afficher une version simplifiée
  if (fromHeader) {
    return (
      <SimpleAuthDialog
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleSuccess}
        onRegisterClick={onRegisterClick}
        onCarrierRegisterClick={onCarrierRegisterClick}
      />
    );
  }

  // Si un type d'utilisateur spécifique est requis, ne pas afficher les onglets
  if (requiredUserType) {
    return (
      <RequiredUserAuthDialog
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleSuccess}
        requiredUserType={requiredUserType}
        onRegisterClick={onRegisterClick}
        onCarrierRegisterClick={onCarrierRegisterClick}
      />
    );
  }

  // Sinon, afficher les onglets avec les deux options
  return (
    <TabsAuthDialog
      isOpen={isOpen}
      onClose={onClose}
      defaultTab={defaultTab}
      onSuccess={handleSuccess}
      onRegisterClick={onRegisterClick}
      onCarrierRegisterClick={onCarrierRegisterClick}
    />
  );
}