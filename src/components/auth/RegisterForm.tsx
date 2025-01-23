import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "./register/RegisterFormFields";
import { RegisterFormState } from "./register/types";

interface RegisterFormProps {
  onLogin: () => void;
  isLoading: boolean;
  formState: RegisterFormState;
  showSuccessDialog: boolean;
  handleFieldChange: (field: keyof RegisterFormState, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseSuccessDialog: () => void;
}

export function RegisterForm({
  onLogin,
  isLoading,
  formState,
  showSuccessDialog,
  handleFieldChange,
  handleSubmit,
  handleCloseSuccessDialog,
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
          formState={formState}
          isLoading={isLoading}
          showSuccessDialog={showSuccessDialog}
          onFieldChange={handleFieldChange}
          onCloseSuccessDialog={handleCloseSuccessDialog}
        />

        <div className="pt-4 space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
            disabled={isLoading}
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