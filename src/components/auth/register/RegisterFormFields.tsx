import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function RegisterFormFields({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: RegisterFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail">Email</Label>
        <Input
          id="registerEmail"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPassword">Mot de passe</Label>
        <Input
          id="registerPassword"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}