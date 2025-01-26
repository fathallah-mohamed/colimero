import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActivationForm } from "@/components/auth/client/ActivationForm";

interface ActivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onSuccess?: () => void;
}

export function ActivationDialog({
  isOpen,
  onClose,
  email,
  onSuccess
}: ActivationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Activation de votre compte
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Veuillez entrer le code d'activation reçu par email
          </p>
          
          <ActivationForm 
            email={email}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}