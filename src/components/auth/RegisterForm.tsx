import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "./register/RegisterFormFields";

interface RegisterFormProps {
  onLogin: () => void;
  isLoading: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  address: string;
  password: string;
  confirmPassword: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPhoneSecondary: (value: string) => void;
  setAddress: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  areRequiredFieldsFilled: () => boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  onLogin,
  isLoading,
  firstName,
  lastName,
  email,
  phone,
  phone_secondary,
  address,
  password,
  confirmPassword,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setPhoneSecondary,
  setAddress,
  setPassword,
  setConfirmPassword,
  areRequiredFieldsFilled,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Créer un compte client</h2>
        <p className="text-gray-600">
          Créez votre compte client pour commencer à expédier vos colis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegisterFormFields
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          phone_secondary={phone_secondary}
          address={address}
          password={password}
          confirmPassword={confirmPassword}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPhoneSecondaryChange={setPhoneSecondary}
          onAddressChange={setAddress}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          isLoading={isLoading}
        />

        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            disabled={isLoading || !areRequiredFieldsFilled()}
          >
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>

          <div className="text-center text-sm pb-2">
            <button
              type="button"
              className="text-[#00B0F0] hover:underline"
              onClick={onLogin}
            >
              Déjà un compte ? Se connecter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}