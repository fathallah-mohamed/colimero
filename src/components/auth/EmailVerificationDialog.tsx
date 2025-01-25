import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VerificationDialogContent } from "./verification/VerificationDialogContent";
import { ConfirmationDialog } from "./verification/ConfirmationDialog";
import { useVerificationEmail } from "@/hooks/auth/useVerificationEmail";

export interface EmailVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  showConfirmationDialog?: boolean;
  onConfirmationClose?: () => void;
  onResendEmail: () => void;
}

export function EmailVerificationDialog({ 
  isOpen, 
  onClose, 
  email,
  showConfirmationDialog = false,
  onConfirmationClose,
  onResendEmail
}: EmailVerificationDialogProps) {
  const { isResending, sendVerificationEmail } = useVerificationEmail();

  const handleResendEmail = async () => {
    const success = await sendVerificationEmail(email);
    if (success) {
      onResendEmail();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Compte non activé
            </DialogTitle>
          </DialogHeader>
          
          <VerificationDialogContent
            email={email}
            isResending={isResending}
            onResendEmail={handleResendEmail}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog 
        open={showConfirmationDialog} 
        onClose={onConfirmationClose}
      />
    </>
  );
}