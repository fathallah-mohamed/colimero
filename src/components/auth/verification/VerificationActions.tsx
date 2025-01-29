import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VerificationActionsProps {
  isLoading: boolean;
  activationCode: string;
  onResendEmail: () => void;
}

export function VerificationActions({ isLoading, activationCode, onResendEmail }: VerificationActionsProps) {
  return (
    <>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !activationCode}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Activation en cours...
          </>
        ) : (
          "Activer mon compte"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">ou</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={onResendEmail}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Recevoir un nouveau code"
        )}
      </Button>
    </>
  );
}