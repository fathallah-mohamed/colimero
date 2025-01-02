import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface RegisterFormFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  address: string;
  idDocument: File | null;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onIdDocumentChange: (file: File | null) => void;
}

export function RegisterFormFields({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  birthDate,
  address,
  idDocument,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onBirthDateChange,
  onAddressChange,
  onIdDocumentChange,
}: RegisterFormFieldsProps) {
  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  const OptionalLabel = ({ children }: { children: React.ReactNode }) => (
    <Label className="flex items-center gap-1">
      {children}
      <span className="text-sm text-gray-500">(Recommandé)</span>
    </Label>
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <RequiredLabel htmlFor="firstName">Prénom</RequiredLabel>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <RequiredLabel htmlFor="lastName">Nom</RequiredLabel>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <RequiredLabel htmlFor="registerEmail">Email</RequiredLabel>
        <Input
          id="registerEmail"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <RequiredLabel htmlFor="phone">Téléphone</RequiredLabel>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <RequiredLabel htmlFor="registerPassword">Mot de passe</RequiredLabel>
        <Input
          id="registerPassword"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <RequiredLabel htmlFor="confirmPassword">Confirmer le mot de passe</RequiredLabel>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <OptionalLabel htmlFor="birthDate">Date de naissance</OptionalLabel>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => onBirthDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <OptionalLabel htmlFor="address">Adresse</OptionalLabel>
        <Input
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Votre adresse complète"
        />
      </div>

      <div className="space-y-2">
        <OptionalLabel htmlFor="idDocument">Pièce d'identité</OptionalLabel>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('idDocument')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {idDocument ? 'Changer le fichier' : 'Télécharger'}
          </Button>
          {idDocument && (
            <span className="text-sm text-gray-500">{idDocument.name}</span>
          )}
        </div>
        <input
          id="idDocument"
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => onIdDocumentChange(e.target.files?.[0] || null)}
        />
      </div>
    </>
  );
}