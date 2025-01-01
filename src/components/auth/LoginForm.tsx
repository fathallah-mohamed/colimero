import { useLoginForm } from "./login/useLoginForm";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginFormActions } from "./login/LoginFormActions";
import { Form } from "@/components/ui/form";

interface LoginFormProps {
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  onRegisterClick?: () => void;
  isBookingFlow?: boolean;
  isCreateTourFlow?: boolean;
}

export default function LoginForm({ 
  onSuccess, 
  requiredUserType,
  onRegisterClick,
  isBookingFlow,
  isCreateTourFlow
}: LoginFormProps) {
  const { form, onSubmit, isLoading } = useLoginForm({ onSuccess, requiredUserType });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LoginFormFields form={form} isLoading={isLoading} />
        <LoginFormActions 
          onRegisterClick={onRegisterClick}
          isBookingFlow={isBookingFlow}
          isCreateTourFlow={isCreateTourFlow}
        />
      </form>
    </Form>
  );
}