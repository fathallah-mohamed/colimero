import { Button } from "@/components/ui/button";

interface LoginFormActionsProps {
  isLoading: boolean;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function LoginFormActions({
  isLoading,
  onForgotPassword,
  onRegister,
}: LoginFormActionsProps) {
  return (
    <>
      <Button
        type="submit"
        className="w-full bg-[#00B0F0] hover:bg-[#0082b3] text-white"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      <div className="flex justify-between text-sm">
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
        <button
          type="button"
          className="text-[#00B0F0] hover:underline"
          onClick={onRegister}
        >
          Créer un compte
        </button>
      </div>
    </>
  );
}