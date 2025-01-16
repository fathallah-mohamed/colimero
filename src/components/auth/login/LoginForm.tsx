import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "./useLoginForm";

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
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    showVerificationDialog,
    showErrorDialog,
    setShowVerificationDialog,
    setShowErrorDialog,
    handleSubmit,
  } = useLoginForm({ onSuccess, requiredUserType });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginFormFields
        email={email}
        password={password}
        isLoading={isLoading}
        error={error}
        showVerificationDialog={showVerificationDialog}
        showErrorDialog={showErrorDialog}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onVerificationDialogClose={() => setShowVerificationDialog(false)}
        onErrorDialogClose={() => setShowErrorDialog(false)}
      />

      <div className="space-y-6">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white h-12 text-base font-semibold"
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

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onRegister}
                className="h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Compte client
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCarrierRegister}
                className="h-12 border-2 border-client text-client hover:bg-client hover:text-white transition-colors"
              >
                Compte transporteur
              </Button>
            </div>
          </>
        )}

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors"
            onClick={onForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </form>
  );
}