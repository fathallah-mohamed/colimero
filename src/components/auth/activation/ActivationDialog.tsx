import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActivationForm } from "./ActivationForm";

interface ActivationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
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
          <DialogTitle className="text-center text-xl">
            Activation du compte
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Entrez le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>
          </p>
          
          <ActivationForm 
            email={email}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}