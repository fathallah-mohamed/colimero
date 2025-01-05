import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ClientLoginForm } from "../login/ClientLoginForm";
import { Button } from "@/components/ui/button";

interface SimpleAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onRegisterClick: () => void;
  onCarrierRegisterClick: () => void;
}

export function SimpleAuthDialog({
  isOpen,
  onClose,
  onSuccess,
  onRegisterClick,
  onCarrierRegisterClick,
}: SimpleAuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Connexion</DialogTitle>
        <div className="space-y-6">
          <ClientLoginForm
            onForgotPassword={() => {}}
            onRegister={onRegisterClick}
            onSuccess={onSuccess}
            hideRegisterButton={false}
          />
          <div className="space-y-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCarrierRegisterClick}
              className="w-full"
            >
              Devenir transporteur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}