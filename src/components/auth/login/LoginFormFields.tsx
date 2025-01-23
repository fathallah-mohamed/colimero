import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailVerificationDialog } from "../EmailVerificationDialog";
import { ErrorDialog } from "@/components/ui/error-dialog";

export interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  error?: string | null;
  showVerificationDialog: boolean;
  showErrorDialog: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onVerificationDialogClose: () => void;
  onErrorDialogClose: () => void;
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
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {showVerificationDialog && (
        <EmailVerificationDialog
          isOpen={showVerificationDialog}
          onClose={onVerificationDialogClose}
          email={email}
          isResending={false}
          onResendEmail={() => {}}
        />
      )}

      {showErrorDialog && error && (
        <ErrorDialog
          isOpen={showErrorDialog}
          onClose={onErrorDialogClose}
          title="Erreur"
          description={error}
        />
      )}
    </div>
  );
}