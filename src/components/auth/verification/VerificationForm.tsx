import { Alert, AlertDescription } from "@/components/ui/alert";
import { VerificationCodeInput } from "./VerificationCodeInput";
import { VerificationActions } from "./VerificationActions";

interface VerificationFormProps {
  email: string;
  error: string | null;
  isLoading: boolean;
  activationCode: string;
  onActivationCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendEmail: () => void;
}

export function VerificationForm({
  email,
  error,
  isLoading,
  activationCode,
  onActivationCodeChange,
  onSubmit,
  onResendEmail,
}: VerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-center text-gray-600">
        Pour activer votre compte, veuillez entrer le code d'activation reçu par email à l'adresse <span className="font-medium">{email}</span>
      </p>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <VerificationCodeInput
        value={activationCode}
        onChange={onActivationCodeChange}
        isLoading={isLoading}
      />

      <VerificationActions
        isLoading={isLoading}
        activationCode={activationCode}
        onResendEmail={onResendEmail}
      />

      <p className="text-sm text-gray-500 text-center">
        Le code d'activation est valable pendant 48 heures
      </p>
    </form>
  );
}