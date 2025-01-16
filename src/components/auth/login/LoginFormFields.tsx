import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";

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
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isLoading}
          placeholder="exemple@email.com"
          className="h-12"
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
          placeholder="Votre mot de passe"
          className="h-12"
          required
        />
      </div>

      {error && showErrorDialog && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={onVerificationDialogClose}
        email={email}
      />
    </div>
  );
}