import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "./useLoginForm";

interface ClientLoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onSuccess?: () => void;
}

export function ClientLoginForm({
  onForgotPassword,
  onRegister,
  onSuccess,
}: ClientLoginFormProps) {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLoginForm(onSuccess, 'client');

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
          className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>

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

        <Button
          type="button"
          variant="outline"
          onClick={onRegister}
          className="w-full"
        >
          Créer un compte client
        </Button>

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