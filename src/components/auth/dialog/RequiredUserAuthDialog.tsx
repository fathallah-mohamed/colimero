import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ClientLoginForm } from "../login/ClientLoginForm";
import { CarrierLoginForm } from "../login/CarrierLoginForm";

interface RequiredUserAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requiredUserType: 'client' | 'carrier';
  onRegisterClick?: () => void;
  onCarrierRegisterClick?: () => void;
}

export function RequiredUserAuthDialog({
  isOpen,
  onClose,
  onSuccess,
  requiredUserType,
  onRegisterClick,
  onCarrierRegisterClick,
}: RequiredUserAuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {requiredUserType === 'client' ? 'Connexion Client' : 'Connexion Transporteur'}
        </DialogTitle>
        <div className="space-y-6">
          {requiredUserType === 'client' ? (
            <ClientLoginForm
              onForgotPassword={() => {}}
              onRegister={onRegisterClick}
              onSuccess={onSuccess}
              requiredUserType={requiredUserType}
              hideRegisterButton={false}
            />
          ) : (
            <CarrierLoginForm
              onForgotPassword={() => {}}
              onCarrierRegister={onCarrierRegisterClick}
              onSuccess={onSuccess}
              requiredUserType={requiredUserType}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}