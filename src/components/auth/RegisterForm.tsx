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
  } = useRegisterForm(onLogin);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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

      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading || acceptedConsents.length === 0}
      >
        {isLoading ? "Création en cours..." : "Créer mon compte"}
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onLogin}
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </form>
  );
}