import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  error?: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginFormFields({
  email,
  password,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="votre@email.fr"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Votre mot de passe"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
    </div>
  );
}