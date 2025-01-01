import { Button } from "@/components/ui/button";

interface LoginFormActionsProps {
  onRegisterClick?: () => void;
  isBookingFlow?: boolean;
  isCreateTourFlow?: boolean;
}

export function LoginFormActions({ 
  onRegisterClick,
  isBookingFlow,
  isCreateTourFlow
}: LoginFormActionsProps) {
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou
          </span>
        </div>
      </div>

      {isBookingFlow && (
        <Button
          variant="outline"
          type="button"
          onClick={onRegisterClick}
        >
          Créer un compte client
        </Button>
      )}

      {isCreateTourFlow && (
        <Button
          variant="outline"
          type="button"
          onClick={onRegisterClick}
        >
          Devenir transporteur
        </Button>
      )}

      {!isBookingFlow && !isCreateTourFlow && (
        <>
          <Button
            variant="outline"
            type="button"
            onClick={onRegisterClick}
          >
            Créer un compte client
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={onRegisterClick}
          >
            Devenir transporteur
          </Button>
        </>
      )}
    </div>
  );
}