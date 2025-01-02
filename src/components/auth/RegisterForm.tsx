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
    birthDate,
    setBirthDate,
    address,
    setAddress,
    idDocument,
    setIdDocument,
    acceptedConsents,
    handleConsentChange,
    handleSubmit,
    requiredConsentsCount,
    allRequiredConsentsAccepted,
    areRequiredFieldsFilled,
  } = useRegisterForm(onLogin);

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 px-1">
        <RegisterFormFields
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          password={password}
          confirmPassword={confirmPassword}
          birthDate={birthDate}
          address={address}
          idDocument={idDocument}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onBirthDateChange={setBirthDate}
          onAddressChange={setAddress}
          onIdDocumentChange={setIdDocument}
        />

        <RegisterTerms
          acceptedConsents={acceptedConsents}
          onConsentChange={handleConsentChange}
        />
      </form>

      <div className="pt-4 space-y-4 border-t mt-4">
        <Button
          type="submit"
          className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
          disabled={isLoading || !areRequiredFieldsFilled()}
          onClick={handleSubmit}
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
      </div>
    </div>
  );
}