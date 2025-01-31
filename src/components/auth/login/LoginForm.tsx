import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoginFormFields } from "./LoginFormFields";
import { LoginFormButtons } from "./LoginFormButtons";
import { LoginFormDialogs } from "./LoginFormDialogs";
import { LoginFormValues } from "./LoginFormFields";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
  hideRegisterButton?: boolean;
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
  hideRegisterButton = false,
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    isLoading,
    error,
    handleLogin
  } = useAuth({ 
    onSuccess,
    requiredUserType,
    onVerificationNeeded: () => {
      setShowVerificationDialog(true);
      form.reset({ email: form.getValues("email"), password: "" });
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    await handleLogin(values.email, values.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoginFormFields
          form={form}
          isLoading={isLoading}
          error={error}
        />

        <LoginFormButtons
          isLoading={isLoading}
          onForgotPassword={onForgotPassword}
          onRegister={onRegister}
          onCarrierRegister={onCarrierRegister}
          hideRegisterButton={hideRegisterButton}
          requiredUserType={requiredUserType}
        />

        <LoginFormDialogs
          showVerificationDialog={showVerificationDialog}
          showErrorDialog={showErrorDialog}
          error={error}
          email={form.getValues("email")}
          onVerificationDialogClose={() => setShowVerificationDialog(false)}
          onErrorDialogClose={() => setShowErrorDialog(false)}
        />
      </form>
    </Form>
  );
}