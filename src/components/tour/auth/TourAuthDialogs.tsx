import { Dialog, DialogContent } from "@/components/ui/dialog";
import AuthDialog from "@/components/auth/AuthDialog";
import { RegisterForm } from "@/components/auth/RegisterForm";

interface TourAuthDialogsProps {
  showAuthDialog: boolean;
  showRegisterForm: boolean;
  onAuthClose: () => void;
  onRegisterClose: () => void;
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export function TourAuthDialogs({
  showAuthDialog,
  showRegisterForm,
  onAuthClose,
  onRegisterClose,
  onRegisterClick,
  onLoginClick,
}: TourAuthDialogsProps) {
  return (
    <>
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={onAuthClose}
        onRegisterClick={onRegisterClick}
        onCarrierRegisterClick={onRegisterClick}
        requiredUserType="client"
      />

      <Dialog open={showRegisterForm} onOpenChange={onRegisterClose}>
        <DialogContent className="max-w-2xl">
          <RegisterForm onLogin={onLoginClick} />
        </DialogContent>
      </Dialog>
    </>
  );
}