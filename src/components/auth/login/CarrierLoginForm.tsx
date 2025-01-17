import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "./useLoginForm";

interface CarrierLoginFormProps {
  onForgotPassword: () => void;
  onCarrierRegister: () => void;
  onSuccess?: () => void;
  requiredUserType?: 'client' | 'carrier';
}

export function CarrierLoginForm({
  onForgotPassword,
  onCarrierRegister,
  onSuccess,
  requiredUserType,
}: CarrierLoginFormProps) {
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
  } = useLoginForm({ onSuccess, requiredUserType: 'carrier' });

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

        {(!requiredUserType || requiredUserType === 'carrier') && (
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

            <Button
              type="button"
              variant="outline"
              onClick={onCarrierRegister}
              className="w-full"
            >
              Devenir transporteur
            </Button>
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