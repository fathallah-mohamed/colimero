import { Button } from "@/components/ui/button";
import { useLoginForm } from "./useLoginForm";
import { LoginFormFields } from "./LoginFormFields";

interface GeneralLoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
}

export function GeneralLoginForm({
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  onSuccess,
}: GeneralLoginFormProps) {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLoginForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LoginFormFields
        email={email}
        password={password}
        isLoading={isLoading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />

      <div className="flex flex-col space-y-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-primary hover:underline"
          >
            Mot de passe oublié ?
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="text-primary hover:underline"
          >
            Créer un compte client
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onCarrierRegister}
            className="text-sm text-primary hover:underline"
          >
            Vous êtes transporteur ? Inscrivez-vous ici
          </button>
        </div>
      </div>
    </form>
  );
}