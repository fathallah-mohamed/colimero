import { Input } from "@/components/ui/input";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

      <Dialog open={showErrorDialog} onOpenChange={onErrorDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-50 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Erreur de connexion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              {error}
            </p>
            <div className="flex justify-center">
              <Button onClick={onErrorDialogClose} className="bg-[#00B0F0] hover:bg-[#0082b3] text-white">
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}