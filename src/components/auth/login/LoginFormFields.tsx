import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginFormFields({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
}: LoginFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
    </>
  );
}