import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface VerificationAlertProps {
  email: string;
  error: string | null;
}

export function VerificationAlert({ email, error }: VerificationAlertProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <CheckCircle2 className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700">
        Un email d'activation vous a été envoyé à l'adresse <span className="font-medium">{email}</span>
      </AlertDescription>
    </Alert>
  );
}