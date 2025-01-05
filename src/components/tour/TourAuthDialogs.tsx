import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RegisterForm } from "@/components/auth/RegisterForm";
import AuthDialog from "@/components/auth/AuthDialog";

interface TourAuthDialogsProps {
  showAuthDialog: boolean;
  showRegisterForm: boolean;
  setShowAuthDialog: (show: boolean) => void;
  setShowRegisterForm: (show: boolean) => void;
}

export function TourAuthDialogs({
  showAuthDialog,
  showRegisterForm,
  setShowAuthDialog,
  setShowRegisterForm,
}: TourAuthDialogsProps) {
  return (
    <>
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        requiredUserType="client"
        onRegisterClick={() => {
          setShowAuthDialog(false);
          setShowRegisterForm(true);
        }}
      />

      <Dialog open={showRegisterForm} onOpenChange={setShowRegisterForm}>
        <DialogContent className="max-w-2xl">
          <RegisterForm onLogin={() => {
            setShowRegisterForm(false);
            setShowAuthDialog(true);
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}