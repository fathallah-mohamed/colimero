import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "./useLoginForm";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onForgotPassword?: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  hideRegisterButton?: boolean;
}

export function LoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
  hideRegisterButton = false,
}: LoginFormProps) {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLoginForm({ onSuccess });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginFormFields
        email={email}
        password={password}
        isLoading={isLoading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
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
              <Button
                type="button"
                variant="outline"
                onClick={onRegister}
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Créer un compte client
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onCarrierRegister}
                className="w-full border-2 border-client text-client hover:bg-client hover:text-white transition-colors"
              >
                Devenir transporteur
              </Button>
            </div>
          </>
        )}

        {onForgotPassword && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/90 hover:underline transition-colors"
              onClick={onForgotPassword}
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}
      </div>
    </form>
  );
}