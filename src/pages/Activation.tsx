import { useSearchParams } from "react-router-dom";
import { ActivationStatus } from "@/components/auth/activation/ActivationStatus";
import { useActivation } from "@/hooks/auth/useActivation";

export default function Activation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { status, email, isResending, handleResendEmail } = useActivation(token);

  return (
    <ActivationStatus 
      status={status}
      email={email}
      onResendEmail={handleResendEmail}
      isResending={isResending}
    />
  );
}