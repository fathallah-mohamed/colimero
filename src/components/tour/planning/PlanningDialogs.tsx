import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierSignupForm } from "@/components/auth/carrier-signup/CarrierSignupForm";
import AuthDialog from "@/components/auth/AuthDialog";
import { AccessDeniedMessage } from "@/components/tour/AccessDeniedMessage";
import { useToast } from "@/hooks/use-toast";

interface PlanningDialogsProps {
  isAuthDialogOpen: boolean;
  isAccessDeniedOpen: boolean;
  showCarrierSignupForm: boolean;
  onAuthClose: () => void;
  onAccessDeniedClose: () => void;
  onCarrierSignupClose: (value: boolean) => void;
  onAuthSuccess: () => void;
  onCarrierRegisterClick: () => void;
}

export function PlanningDialogs({
  isAuthDialogOpen,
  isAccessDeniedOpen,
  showCarrierSignupForm,
  onAuthClose,
  onAccessDeniedClose,
  onCarrierSignupClose,
  onAuthSuccess,
  onCarrierRegisterClick,
}: PlanningDialogsProps) {
  const { toast } = useToast();

  return (
    <>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={onAuthClose}
        onSuccess={onAuthSuccess}
        requiredUserType="carrier"
        onRegisterClick={() => onAuthClose()}
        onCarrierRegisterClick={onCarrierRegisterClick}
      />

      <AccessDeniedMessage 
        userType="client" 
        isOpen={isAccessDeniedOpen}
        onClose={onAccessDeniedClose}
      />

      <Dialog open={showCarrierSignupForm} onOpenChange={onCarrierSignupClose}>
        <DialogContent className="max-w-4xl">
          <CarrierSignupForm onSuccess={() => {
            onCarrierSignupClose(false);
            toast({
              title: "Inscription réussie",
              description: "Votre demande d'inscription a été envoyée avec succès.",
            });
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}