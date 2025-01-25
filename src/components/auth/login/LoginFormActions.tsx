import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginFormActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function LoginFormActions({
  isLoading,
  onForgotPassword,
  onRegister,
  onCarrierRegister,
  requiredUserType,
}: LoginFormActionsProps) {
  return (
    <div className="space-y-4">
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      {(!requiredUserType || requiredUserType === 'client' || requiredUserType === 'carrier') && (
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

          <div className="grid gap-2">
            {/* Afficher "Créer un compte client" uniquement si aucun type n'est requis ou si on demande un client */}
            {(!requiredUserType || requiredUserType === 'client') && (
              <Button
                type="button"
                variant="outline"
                onClick={onRegister}
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Créer un compte client
              </Button>
            )}
            {/* Afficher "Devenir transporteur" uniquement si aucun type n'est requis ou si on demande un transporteur */}
            {(!requiredUserType || requiredUserType === 'carrier') && (
              <Button
                type="button"
                variant="outline"
                onClick={onCarrierRegister}
                className="w-full border-2 border-client text-client hover:bg-client hover:text-white transition-colors"
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