import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLoginForm } from "@/hooks/auth/login/useLoginForm";
import { LoginFormFields } from "./form/LoginFormFields";
import { LoginFormButtons } from "./form/LoginFormButtons";
import { LoginFormDialogs } from "./form/LoginFormDialogs";
import { LoginFormProps, LoginFormValues } from "./types";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

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
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleLogin,
  } = useLoginForm({ 
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