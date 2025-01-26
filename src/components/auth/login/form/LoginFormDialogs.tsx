import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { ErrorDialog } from "@/components/ui/error-dialog";

interface LoginFormDialogsProps {
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  error: string | null;
  email: string;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
  onResendEmail: () => void;
}

export function LoginFormDialogs({
  showVerificationDialog,
  showErrorDialog,
  error,
  email,
  onVerificationDialogClose,
  onErrorDialogClose,
  onResendEmail,
}: LoginFormDialogsProps) {
  return (
    <>
      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={onVerificationDialogClose}
        email={email}
        showConfirmationDialog={false}
        onConfirmationClose={() => {}}
        onResendEmail={onResendEmail}
      />

      <ErrorDialog 
        isOpen={showErrorDialog}
        onClose={onErrorDialogClose}
        title="Erreur de connexion"
        description={error || "Une erreur est survenue lors de la connexion"}
      />
    </>
  );
}