import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";
import { ActivationEmailSentDialog } from "./ActivationEmailSentDialog";

interface RegisterFormProps {
  onSuccess: (type: 'new' | 'existing') => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isLoading,
    showEmailSentDialog,
    handleEmailSentDialogClose,
    areRequiredFieldsFilled
  } = useRegisterForm(onSuccess);

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
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            isLoading={isLoading}
          />

          <div className="sticky bottom-0 pt-4 space-y-4 border-t mt-4 bg-white">
            <button
              type="submit"
              className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white py-2 px-4 rounded disabled:opacity-50"
              disabled={isLoading || !areRequiredFieldsFilled()}
            >
              {isLoading ? "Création en cours..." : "Créer mon compte"}
            </button>

            <div className="text-center text-sm pb-2">
              <button
                type="button"
                className="text-[#00B0F0] hover:underline"
                onClick={() => onSuccess('existing')}
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </div>
        </form>
      </div>

      <ActivationEmailSentDialog
        open={showEmailSentDialog}
        onClose={handleEmailSentDialogClose}
      />
    </div>
  );
}