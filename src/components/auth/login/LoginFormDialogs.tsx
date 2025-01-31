import { EmailVerificationDialog } from "../EmailVerificationDialog";

interface LoginFormDialogsProps {
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  error: string | null;
  email: string;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
}

export function LoginFormDialogs({
  showVerificationDialog,
  showErrorDialog,
  error,
  email,
  onVerificationDialogClose,
  onErrorDialogClose
}: LoginFormDialogsProps) {
  return (
    <>
      {showVerificationDialog && (
        <EmailVerificationDialog
          isOpen={showVerificationDialog}
          onClose={onVerificationDialogClose}
          email={email}
        />
      )}
    </>
  );
}