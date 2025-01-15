import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailVerificationDialog } from "@/components/auth/EmailVerificationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  showVerificationDialog?: boolean;
  showErrorDialog?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onVerificationDialogClose?: () => void;
  onErrorDialogClose?: () => void;
}

export function LoginFormFields({
  email,
  password,
  isLoading,
  error,
  showVerificationDialog = false,
  showErrorDialog = false,
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
          required
          placeholder="exemple@email.com"
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
          onClose={() => onVerificationDialogClose?.()}
          email={email}
        />
      )}

      {error && (
        <Dialog open={showErrorDialog} onOpenChange={() => onErrorDialogClose?.()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Erreur</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}