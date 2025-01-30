import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields, LoginFormValues } from "./LoginFormFields";
import { useLoginForm } from "@/hooks/auth/login/useLoginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { EmailVerificationDialog } from "../EmailVerificationDialog";

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
  const navigate = useNavigate();
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
    setShowVerificationDialog,
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
    const result = await handleLogin(values.email, values.password);
    if (result?.success && !showVerificationDialog) {
      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoginFormFields
          form={form}
          isLoading={isLoading}
          error={error}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          {!hideRegisterButton && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Pas encore de compte ?
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {(!requiredUserType || requiredUserType === 'client') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onRegister}
                    className="w-full"
                  >
                    Créer un compte client
                  </Button>
                )}

                {(!requiredUserType || requiredUserType === 'carrier') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCarrierRegister}
                    className="w-full"
                  >
                    Créer un compte transporteur
                  </Button>
                )}
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
              onClick={onForgotPassword}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        {showVerificationDialog && (
          <EmailVerificationDialog
            isOpen={showVerificationDialog}
            onClose={() => setShowVerificationDialog(false)}
            email={form.getValues("email")}
          />
        )}
      </form>
    </Form>
  );
}