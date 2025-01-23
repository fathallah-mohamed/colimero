import { RegisterFormFields } from "./RegisterFormFields";
import { useRegisterForm } from "./useRegisterForm";
import { ActivationEmailSentDialog } from "./ActivationEmailSentDialog";

interface RegisterFormProps {
  onSuccess: (type: 'new' | 'existing') => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { 
    handleSubmit, 
    isLoading, 
    showEmailSentDialog, 
    handleEmailSentDialogClose 
  } = useRegisterForm(onSuccess);

  return (
    <>
      <RegisterFormFields 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      <ActivationEmailSentDialog
        open={showEmailSentDialog}
        onClose={handleEmailSentDialogClose}
      />
    </>
  );
}