import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AccessDeniedMessageProps {
  userType: 'client' | 'carrier';
}

export function AccessDeniedMessage({ userType }: AccessDeniedMessageProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Accès refusé</AlertTitle>
      <AlertDescription>
        {userType === 'client' 
          ? "Cette fonctionnalité est réservée aux clients. Les transporteurs ne peuvent pas réserver de tournées."
          : "Cette fonctionnalité est réservée aux transporteurs. Veuillez vous connecter avec un compte transporteur."
        }
      </AlertDescription>
    </Alert>
  );
}