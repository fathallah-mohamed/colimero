import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormState } from "./types";

export interface RegisterFormFieldsProps {
  formState: RegisterFormState;
  isLoading: boolean;
  onFieldChange: (field: keyof RegisterFormState, value: string) => void;
}

export function RegisterFormFields({
  formState,
  isLoading,
  onFieldChange
}: RegisterFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formState.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formState.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formState.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={formState.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_secondary">Téléphone secondaire (optionnel)</Label>
        <Input
          id="phone_secondary"
          type="tel"
          value={formState.phone_secondary}
          onChange={(e) => onFieldChange('phone_secondary', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formState.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={formState.password}
          onChange={(e) => onFieldChange('password', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
}