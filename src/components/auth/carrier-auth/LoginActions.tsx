import { Button } from "@/components/ui/button";

interface LoginActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onCarrierRegister: () => void;
}

export function LoginActions({ isLoading, onForgotPassword, onCarrierRegister }: LoginActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:underline"
        >
          Mot de passe oublié ?
        </button>

        <div className="text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <button
            type="button"
            onClick={onCarrierRegister}
            className="text-primary hover:underline"
          >
            Devenir transporteur
          </button>
        </div>
      </div>
    </div>
  );
}