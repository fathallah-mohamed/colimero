import { Input } from "@/components/ui/input";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
  showConfirmationDialog?: boolean;
  onConfirmationClose?: () => void;
  onResendEmail?: () => void;
}

export function LoginFormFields({
  email,
  password,
  isLoading,
  error,
  showVerificationDialog,
  showErrorDialog,
  onEmailChange,
  onPasswordChange,
  onVerificationDialogClose,
  onErrorDialogClose,
  showConfirmationDialog,
  onConfirmationClose,
  onResendEmail
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={onVerificationDialogClose}
        email={email}
        isResending={isLoading}
        onResendEmail={onResendEmail || (() => {})}
        showConfirmationDialog={showConfirmationDialog}
        onConfirmationClose={onConfirmationClose}
      />

      <AlertDialog open={showErrorDialog} onOpenChange={onErrorDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <AlertDialogTitle className="text-center">Erreur de connexion</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={onErrorDialogClose} variant="default">
              Fermer
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}