import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StatusMessageProps {
  type: 'default' | 'destructive';
  message: string;
}

export function StatusMessage({ type, message }: StatusMessageProps) {
  return (
    <Alert variant={type}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {type === 'destructive' ? 'Erreur' : 'Attention'}
      </AlertTitle>
      {message}
    </Alert>
  );
}