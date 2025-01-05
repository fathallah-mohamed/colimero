import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ClientLoginForm } from "./ClientLoginForm";
import { CarrierLoginForm } from "./CarrierLoginForm";

interface SimpleLoginViewProps {
  requiredUserType?: "client" | "carrier";
  onRegisterClick: () => void;
  onCarrierRegisterClick: () => void;
  handleSuccess: () => void;
}

export function SimpleLoginView({
  requiredUserType,
  onRegisterClick,
  onCarrierRegisterClick,
  handleSuccess,
}: SimpleLoginViewProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogTitle>
        {requiredUserType === "client" ? "Connexion Client" : "Connexion Transporteur"}
      </DialogTitle>
      {requiredUserType === "client" ? (
        <div className="space-y-6">
          <ClientLoginForm
            onForgotPassword={() => {}}
            onRegister={onRegisterClick}
            onSuccess={handleSuccess}
            requiredUserType={requiredUserType}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onRegisterClick}
            className="w-full"
          >
            Créer un compte client
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <CarrierLoginForm
            onForgotPassword={() => {}}
            onCarrierRegister={onCarrierRegisterClick}
            onSuccess={handleSuccess}
            requiredUserType={requiredUserType}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onCarrierRegisterClick}
            className="w-full"
          >
            Devenir transporteur
          </Button>
        </div>
      )}
    </DialogContent>
  );
}