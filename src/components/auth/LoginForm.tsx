import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields } from "./login/LoginFormFields";
import { useLoginForm } from "./login/useLoginForm";
import { useNavigate } from "react-router-dom";

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

  const handleCarrierRegister = () => {
    navigate("/devenir-transporteur");
  };

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

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
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
              <Button
                type="button"
                variant="outline"
                onClick={onRegister}
                className="w-full"
              >
                Créer un compte client
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCarrierRegister}
                className="w-full"
              >
                Créer un compte transporteur
              </Button>
            </div>
          </>
        )}

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-[#00B0F0] hover:underline"
            onClick={onForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </form>
  );
}