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
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-1 overflow-y-auto px-4">
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

          <div className="sticky bottom-0 pt-4 space-y-4 border-t mt-4 bg-white">
            <Button
              type="submit"
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
              disabled={isLoading || !areRequiredFieldsFilled()}
              onClick={handleSubmit}
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
    </div>
  );
}