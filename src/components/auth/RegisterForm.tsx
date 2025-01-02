import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "./register/RegisterFormFields";
import { RegisterTerms } from "./register/RegisterTerms";
import { useRegisterForm } from "./register/useRegisterForm";

interface RegisterFormProps {
  onLogin: () => void;
}

export function RegisterForm({ onLogin }: RegisterFormProps) {
  const {
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptedConsents,
    handleConsentChange,
    handleSubmit,
    requiredConsentsCount,
    allRequiredConsentsAccepted,
  } = useRegisterForm(onLogin);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-4 overflow-y-auto max-h-[60vh] px-1">
        <RegisterFormFields
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          password={password}
          confirmPassword={confirmPassword}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />

        <RegisterTerms
          acceptedConsents={acceptedConsents}
          onConsentChange={handleConsentChange}
        />
      </div>

      <div className="pt-4 mt-auto">
        <Button
          type="submit"
          className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
          disabled={isLoading || !allRequiredConsentsAccepted}
        >
          {isLoading ? "Création en cours..." : "Créer mon compte"}
        </Button>

        <div className="text-center text-sm mt-4">
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
  );
}