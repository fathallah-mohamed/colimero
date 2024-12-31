import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginFormActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onRegister: () => void;
  onCarrierRegister: () => void;
}

export function LoginFormActions({
  isLoading,
  onForgotPassword,
  onRegister,
  onCarrierRegister,
}: LoginFormActionsProps) {
  return (
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

      <div className="grid gap-2">
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
          onClick={onCarrierRegister}
          className="w-full"
        >
          Devenir transporteur
        </Button>
      </div>

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
  );
}