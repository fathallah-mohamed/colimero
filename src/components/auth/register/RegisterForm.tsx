import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  onSuccess: (type: 'new' | 'existing') => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    formState,
    isLoading,
    showSuccessDialog,
    handleFieldChange,
    handleSubmit,
    handleCloseSuccessDialog,
  } = useRegisterForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RegisterFormFields
        formState={formState}
        isLoading={isLoading}
        showSuccessDialog={showSuccessDialog}
        onFieldChange={handleFieldChange}
        onCloseSuccessDialog={handleCloseSuccessDialog}
      />

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Création en cours..." : "Créer mon compte"}
      </Button>
    </form>
  );
}