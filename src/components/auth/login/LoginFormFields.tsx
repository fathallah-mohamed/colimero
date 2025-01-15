import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailVerificationDialog } from "../EmailVerificationDialog";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  showVerificationDialog?: boolean;
  setShowVerificationDialog?: (show: boolean) => void;
}

export function LoginFormFields({
  email,
  password,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  showVerificationDialog = false,
  setShowVerificationDialog,
}: LoginFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
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

      <div className="grid gap-2">
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

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {showVerificationDialog && setShowVerificationDialog && (
        <EmailVerificationDialog
          isOpen={showVerificationDialog}
          onClose={() => setShowVerificationDialog(false)}
          email={email}
        />
      )}
    </div>
  );
}