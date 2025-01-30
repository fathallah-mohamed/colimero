import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginFormButtonsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  hideRegisterButton?: boolean;
  requiredUserType?: 'client' | 'carrier';
}

export function LoginFormButtons({
  isLoading,
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  hideRegisterButton = false,
  requiredUserType
}: LoginFormButtonsProps) {
  return (
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
                Devenir transporteur
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
  );
}