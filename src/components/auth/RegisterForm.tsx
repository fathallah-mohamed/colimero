import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "./register/RegisterFormFields";
import { useRegisterForm } from "./register/useRegisterForm";
import { EmailVerificationDialog } from "./EmailVerificationDialog";

interface RegisterFormProps {
  onLogin: () => void;
}

export function RegisterForm({ onLogin }: RegisterFormProps) {
  const {
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
    handleSubmit,
    isLoading,
    showEmailSentDialog,
    handleEmailSentDialogClose,
    areRequiredFieldsFilled
  } = useRegisterForm(onLogin);

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

      <EmailVerificationDialog
        isOpen={showEmailSentDialog}
        onClose={handleEmailSentDialogClose}
        email={email}
      />
    </div>
  );
}