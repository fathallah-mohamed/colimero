import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormFieldsProps } from "./types";

export function RegisterFormFields({
  firstName,
  lastName,
  email,
  phone,
  phone_secondary,
  address,
  password,
  confirmPassword,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPhoneSecondaryChange,
  onAddressChange,
  onPasswordChange,
  onConfirmPasswordChange,
  isLoading
}: RegisterFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-1">
            Prénom<span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-1">
            Nom<span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail" className="flex items-center gap-1">
          Email<span className="text-red-500">*</span>
        </Label>
        <Input
          id="registerEmail"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-1">
          Téléphone<span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_secondary">
          Téléphone secondaire
        </Label>
        <Input
          id="phone_secondary"
          type="tel"
          value={phone_secondary}
          onChange={(e) => onPhoneSecondaryChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Adresse
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPassword" className="flex items-center gap-1">
          Mot de passe<span className="text-red-500">*</span>
        </Label>
        <Input
          id="registerPassword"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-1">
          Confirmer le mot de passe<span className="text-red-500">*</span>
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
    </div>
  );
}